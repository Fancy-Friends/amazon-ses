<?php

declare(strict_types=1);

namespace ParticleAcademy\AmazonSes\Actions;

use ParticleAcademy\AmazonSes\AmazonSes;
use ParticleAcademy\Connectors\ConnectorConfigException;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/email-send.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/email-send.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- amazon_ses
 */
/**
 * Send an email through Amazon SES.
 *
 * POST /v2/email/outbound-emails —
 * https://docs.aws.amazon.com/ses/latest/APIReference-V2/API_SendEmail.html
 *
 * This describes the request. The connector client resolves the connection,
 * picks the estate, and either calls Amazon SES or calls the faker.
 */
final class EmailSend
{
    public const OPERATION = 'email_send';
    public const METHOD = 'POST';
    public const PATH = '/v2/email/outbound-emails';
    public const SIDE_EFFECTS = 'unsafe-to-replay';

    /**
     * Build the JSON body for one call.
     *
     * Validation fails loudly and specifically here, rather than three frames
     * later as an "invalid request" from Amazon SES.
     *
     * @param array<string,mixed> $config
     * @return array<string,scalar>
     */
    public static function body(array $config): array
    {
        if (($config['from'] ?? null) === null || ($config['from'] ?? null) === '') {
            throw new ConnectorConfigException('email_send: "from" is required (From).');
        }

        if (($config['to'] ?? null) === null || ($config['to'] ?? null) === '') {
            throw new ConnectorConfigException('email_send: "to" is required (To).');
        }

        if (($config['subject'] ?? null) === null || ($config['subject'] ?? null) === '') {
            throw new ConnectorConfigException('email_send: "subject" is required (Subject).');
        }

        if (! ((($config['text'] ?? null) !== null && ($config['text'] ?? null) !== '') || (($config['html'] ?? null) !== null && ($config['html'] ?? null) !== ''))) {
            throw new ConnectorConfigException('email_send: needs a "text" or "html" body — SES refuses a Content.Simple with neither, and an empty email is never intended.');
        }

        $body = [];

        $value = $config['from'] ?? null;
        $body['FromEmailAddress'] = trim((string) $value);

        $value = $config['to'] ?? null;
        $body['Destination.ToAddresses'] = self::destinationToaddressesList($config['to'] ?? null);

        $value = $config['cc'] ?? null;
        if ($value !== null && $value !== '') {
            $body['Destination.CcAddresses'] = self::destinationCcaddressesList($config['cc'] ?? null);
        }

        $value = $config['replyTo'] ?? null;
        if ($value !== null && $value !== '') {
            $body['ReplyToAddresses'] = self::replytoaddressesList($config['replyTo'] ?? null);
        }

        $value = $config['subject'] ?? null;
        $body['Content.Simple.Subject.Data'] = (string) $value;

        $value = $config['text'] ?? null;
        if ($value !== null && $value !== '') {
            $body['Content.Simple.Body.Text.Data'] = (string) $value;
        }

        $value = $config['html'] ?? null;
        if ($value !== null && $value !== '') {
            $body['Content.Simple.Body.Html.Data'] = (string) $value;
        }

        $value = $config['configurationSet'] ?? null;
        if ($value !== null && $value !== '') {
            $body['ConfigurationSetName'] = (string) $value;
        }

        return self::nestFields($body);
    }

    /**
     * `['properties.email' => x]` -> `['properties' => ['email' => x]]`.
     *
     * A dotted `as` means NESTING, and only a JSON body can nest — in a form
     * body that spelling already means a literal dotted key.
     *
     * @param  array<string,mixed>  $flat
     * @return array<string,mixed>
     */
    private static function nestFields(array $flat): array
    {
        $out = [];

        foreach ($flat as $path => $value) {
            $parts = explode('.', (string) $path);
            $node = &$out;

            while (count($parts) > 1) {
                $key = array_shift($parts);

                if (! isset($node[$key]) || ! is_array($node[$key])) {
                    $node[$key] = [];
                }

                $node = &$node[$key];
            }

            $node[$parts[0]] = $value;
            unset($node);
        }

        return $out;
    }

    /** One value, a ,-separated string, or an array — all end up a list. @return list<string> */
    private static function destinationToaddressesList(mixed $value): array
    {
        if (is_array($value)) {
            $items = array_map(static fn (mixed $item): string => (string) $item, $value);
        } elseif (is_string($value)) {
            $items = explode(',', $value);
        } else {
            return [];
        }

        $items = array_map(trim(...), $items);

        return array_values(array_filter($items, static fn (string $item): bool => $item !== ''));
    }

    /** One value, a ,-separated string, or an array — all end up a list. @return list<string> */
    private static function destinationCcaddressesList(mixed $value): array
    {
        if (is_array($value)) {
            $items = array_map(static fn (mixed $item): string => (string) $item, $value);
        } elseif (is_string($value)) {
            $items = explode(',', $value);
        } else {
            return [];
        }

        $items = array_map(trim(...), $items);

        return array_values(array_filter($items, static fn (string $item): bool => $item !== ''));
    }

    /** One value, a ,-separated string, or an array — all end up a list. @return list<string> */
    private static function replytoaddressesList(mixed $value): array
    {
        if (is_array($value)) {
            $items = array_map(static fn (mixed $item): string => (string) $item, $value);
        } elseif (is_string($value)) {
            $items = explode(',', $value);
        } else {
            return [];
        }

        $items = array_map(trim(...), $items);

        return array_values(array_filter($items, static fn (string $item): bool => $item !== ''));
    }
}
