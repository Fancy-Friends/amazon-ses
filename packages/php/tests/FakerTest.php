<?php

declare(strict_types=1);

use ParticleAcademy\AmazonSes\AmazonSesFaker;
use ParticleAcademy\Connectors\FakeValues;

/*
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/fixtures/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/fixtures/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- amazon_ses
 */
/**
 * The golden fixtures — the SAME values the TypeScript and Python packages
 * assert.
 *
 * Bit-for-bit identical is the claim, and this is what checks it.
 * Cross-runtime drift does not fail loudly on its own: it completes, down one
 * path, with no error.
 */

it('email_send fakes the shape Amazon SES publishes', function () {
    $config = [];
    $fake = new FakeValues(FakeValues::seedForCall('amazon_ses', 'email_send', $config));

    $faked = AmazonSesFaker::respond('email_send', ['config' => $config, 'fake' => $fake]);

    expect($faked)->toBe([
        'MessageId' => 'de630d8a45905e0384533c4b989f99661ddefb5f941a3aa5ba909342b7e8',
    ]);
});

it('throws for an operation with no fixture rather than inventing a shape', function () {
    $fake = new FakeValues(FakeValues::seedForCall('amazon_ses', 'no_such_operation', []));

    expect(fn () => AmazonSesFaker::respond('no_such_operation', ['config' => [], 'fake' => $fake]))
        ->toThrow(InvalidArgumentException::class);
});
