/**
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
 * The golden fixtures.
 *
 * Deterministic on purpose: the same seed produces the same bytes in
 * TypeScript, PHP and Python, so this file and its twins in the other packages
 * assert the SAME values. That turns the faker into a parity test rather than
 * a convenience — which matters, because cross-runtime drift does not fail
 * loudly. It completes, down one path, with no error.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { fakeRequest } from "@particle-academy/fancy-connector-core";

import { amazonSesFaker } from "../src/faker.js";

test("email_send fakes the shape Amazon SES publishes", () => {
  const config = {};

  const faked = amazonSesFaker("email_send", fakeRequest("amazon_ses", "email_send", config));

  assert.deepEqual(faked, {
    "MessageId": "de630d8a45905e0384533c4b989f99661ddefb5f941a3aa5ba909342b7e8"
  });
});

test("an operation with no fixture throws rather than inventing a shape", () => {
  assert.throws(() => amazonSesFaker("no_such_operation", fakeRequest("amazon_ses", "no_such_operation", {})), /no fake response/);
});
