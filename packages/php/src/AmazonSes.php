<?php

declare(strict_types=1);

namespace ParticleAcademy\AmazonSes;

use ParticleAcademy\Connectors\Mode;
use ParticleAcademy\Connectors\PreparedRequest;
use ParticleAcademy\Connectors\SandboxKind;
use ParticleAcademy\\Connectors\\SigV4;
use ParticleAcademy\Connectors\ServiceDescriptor;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/manifest.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/manifest.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- amazon_ses
 */
/**
 * Amazon SES, as one service descriptor shared by every Amazon SES operation.
 *
 * The PHP twin of the js package's `src/service.ts`.
 *
 * ## The sandbox trap, written down where it is used
 *
 * A new SES account is in the SANDBOX, and it is the reason `restricted-reach`
 * exists as a value. The endpoint is identical, the credentials are identical,
 * the request is identical, and the API answers 200 with a MessageId -- but
 * the mail only reaches addresses you have verified. Anyone else is silently
 * discarded. So a sandbox run looks completely successful and reached nobody,
 * which is why `restricted-reach` cannot be selected as a mode: there is
 * nothing to select. You leave the sandbox by asking AWS for production
 * access, not by pointing at a different host.
 */
final class AmazonSes
{
    // The connector API version this package was GENERATED against. A
    // literal, never imported: an imported constant lets an upgrade rewrite
    // the very claim it exists to detect.
    public const CONNECTOR_API_VERSION = 1;

    public const SERVICE = 'amazon_ses';

    public const LIVE_URL = 'https://email.{region}.amazonaws.com';
    public const COMMENT_URL = 'The host carries the REGION, which is a per-connection credential rather than a constant. Every provider before this one had a base URL that was the same string for everybody.';

    /** @var list<string> Credential keys a remote call cannot proceed without. */
    public const REQUIRES = [
        'accessKeyId',
        'secretAccessKey',
        'region',
    ];

    public static function descriptor(): ServiceDescriptor
    {
        return new ServiceDescriptor(
            service: self::SERVICE,
            title: 'Amazon SES',
            sandbox: SandboxKind::RestrictedReach,
            baseUrls: [
                Mode::Live->value => self::LIVE_URL,
                Mode::Comment->value => self::COMMENT_URL,
            ],
            requires: self::REQUIRES,
            authorize: self::authorize(...),
            faker: AmazonSesFaker::respond(...),
        );
    }

    /**
     * Apply Amazon SES's auth scheme to an outgoing request.
     *
     * Signature Version 4, read from AWS's own service model
     * (metadata.signatureVersion = v4, signingName = ses). Not a header holding a
     * key: the request is SIGNED, so the method, the path, the query, the headers
     * and a hash of the body all go into a canonical form that is HMAC'd with a
     * key derived from the secret, the date, the region and the service. Nothing
     * else in this kit signs a request -- every provider so far presents a static
     * credential.
     *
     * @param array<string,string> $credentials
     */
    public static function authorize(array $credentials, PreparedRequest $request, Mode $mode): void
    {
        $request->url = str_replace('{region}', (string) ($credentials['region'] ?? ''), $request->url);

        $host = parse_url($request->url, PHP_URL_HOST) ?: '';
        $signed = SigV4::sign(
            $request->method,
            $request->url,
            array_merge($request->headers, ['host' => $host]),
            $request->body,
            (string) ($credentials['accessKeyId'] ?? ''),
            (string) ($credentials['secretAccessKey'] ?? ''),
            (string) ($credentials['region'] ?? ''),
            'ses',
        );

        // `host` is SIGNED but not carried: the transport sets it from
        // the URL, and omitting it from the signature is a mismatch.
        $request->withHeader('x-amz-date', $signed['amzDate']);
        $request->withHeader('x-amz-content-sha256', (string) $signed['headers']['x-amz-content-sha256']);
        $request->withHeader('Authorization', $signed['authorization']);
    }
}
