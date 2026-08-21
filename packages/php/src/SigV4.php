<?php

declare(strict_types=1);

namespace ParticleAcademy\Connectors;

/**
 * AWS Signature Version 4 — the PHP twin of the TypeScript and Python signers.
 *
 * Every other provider in this kit PRESENTS a credential. This one SIGNS: the
 * method, the path, the query, the headers and a hash of the body go into a
 * canonical form, which is hashed and HMAC'd with a key derived in four steps
 * from the secret, the date, the region and the service.
 *
 * The three implementations are pinned against AWS's OWN published test
 * vectors, not against each other. Three copies that agree prove they are
 * consistent; only an external vector proves they are right.
 *
 * The clock is a parameter because a function that reads it cannot be tested
 * for a fixed answer. The secret never leaves this file — it derives the
 * signing key, and what crosses the wire is the key id, the scope, the signed
 * header names and a hex digest.
 */
final class SigV4
{
    private const ALGORITHM = 'AWS4-HMAC-SHA256';

    /**
     * @param  array<string,string>  $headers
     * @return array{authorization: string, amzDate: string, headers: array<string,string>}
     */
    public static function sign(
        string $method,
        string $url,
        array $headers,
        ?string $body,
        string $accessKeyId,
        string $secretAccessKey,
        string $region,
        string $service,
        ?int $now = null,
        bool $signBody = true,
    ): array {
        $timestamp = $now ?? time();
        $amzDate = gmdate('Ymd\THis\Z', $timestamp);
        $dateStamp = gmdate('Ymd', $timestamp);

        $payload = $body ?? '';
        $payloadHash = hash('sha256', $payload);

        $headers['x-amz-date'] = $amzDate;
        if ($signBody) {
            $headers['x-amz-content-sha256'] = $payloadHash;
        }

        // Lowercased, trimmed, inner whitespace collapsed, sorted by name. The
        // order is part of what is signed, so the same headers in a different
        // order are a different signature.
        $canonical = [];
        foreach ($headers as $name => $value) {
            $canonical[strtolower($name)] = preg_replace('/\s+/', ' ', trim((string) $value));
        }
        ksort($canonical, SORT_STRING);

        $canonicalHeaders = '';
        foreach ($canonical as $name => $value) {
            $canonicalHeaders .= $name.':'.$value."\n";
        }
        $signedHeaders = implode(';', array_keys($canonical));

        $parts = parse_url($url);
        $path = $parts['path'] ?? '/';

        $query = [];
        parse_str($parts['query'] ?? '', $parsed);
        foreach ($parsed as $key => $value) {
            $query[rawurlencode((string) $key)] = rawurlencode((string) $value);
        }
        ksort($query, SORT_STRING);

        $canonicalQuery = [];
        foreach ($query as $key => $value) {
            $canonicalQuery[] = $key.'='.$value;
        }

        $canonicalRequest = implode("\n", [
            strtoupper($method),
            $path === '' ? '/' : $path,
            implode('&', $canonicalQuery),
            $canonicalHeaders,
            $signedHeaders,
            $payloadHash,
        ]);

        $scope = $dateStamp.'/'.$region.'/'.$service.'/aws4_request';
        $stringToSign = implode("\n", [
            self::ALGORITHM,
            $amzDate,
            $scope,
            hash('sha256', $canonicalRequest),
        ]);

        // Four steps, each keyed by the last — which is what makes a signature
        // usable only for one date, one region and one service.
        $kDate = hash_hmac('sha256', $dateStamp, 'AWS4'.$secretAccessKey, true);
        $kRegion = hash_hmac('sha256', $region, $kDate, true);
        $kService = hash_hmac('sha256', $service, $kRegion, true);
        $kSigning = hash_hmac('sha256', 'aws4_request', $kService, true);
        $signature = hash_hmac('sha256', $stringToSign, $kSigning);

        return [
            'amzDate' => $amzDate,
            'headers' => $headers,
            'authorization' => self::ALGORITHM.' Credential='.$accessKeyId.'/'.$scope
                .', SignedHeaders='.$signedHeaders
                .', Signature='.$signature,
        ];
    }

    /** The signature alone, which is what AWS's published vectors assert. */
    public static function signatureOf(string $authorization): string
    {
        $marker = 'Signature=';

        return substr($authorization, (int) strpos($authorization, $marker) + strlen($marker));
    }
}
