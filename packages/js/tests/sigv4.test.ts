/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/manifest.json (via weaver's tests/support/sigv4/) by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/manifest.json (via weaver's tests/support/sigv4/) (or weaver's template/) and regenerate:
 *
 *     npm run provider -- amazon_ses
 */

/**
 * AWS Signature Version 4, against AWS's published test suite.
 *
 * Copied from awslabs/aws-c-auth, which is AWS's own signing test suite. Three
 * implementations of this algorithm exist in this kit — TypeScript here, PHP
 * and Python in the sibling packages. Three copies agreeing with each other
 * proves they are CONSISTENT; only an external vector proves they are RIGHT.
 *
 * Two cases, deliberately: `get-vanilla` covers the algorithm, and
 * `post-x-www-form-urlencoded` covers it WITH a body and extra headers, so
 * payload hashing and header sorting are covered too. The first alone passes
 * for a signer that hashes nothing.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { signRequest, signatureOf } from "../src/sigv4.js";

const CREDENTIALS = {
  accessKeyId: "AKIDEXAMPLE",
  secretAccessKey: "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY",
  region: "us-east-1",
  service: "service",
  now: new Date("2015-08-30T12:36:00Z"),
};

test("get-vanilla — the algorithm itself", () => {
  const signed = signRequest({
    ...CREDENTIALS,
    method: "GET",
    url: "https://example.amazonaws.com/",
    headers: { Host: "example.amazonaws.com" },
    signBody: false,
  });

  assert.equal(
    signatureOf(signed.authorization),
    "5fa00fa31553b73ebf1942676e86291e8372ff2a2260956d9b8aae1d763fbf31",
  );
});

test("post-x-www-form-urlencoded — with a body, and the headers that come with one", () => {
  // This is the half that catches a signer which hashes nothing: the payload
  // hash appears twice, once as `x-amz-content-sha256` and once as the last
  // line of the canonical request.
  const signed = signRequest({
    ...CREDENTIALS,
    method: "POST",
    url: "https://example.amazonaws.com/",
    headers: {
      Host: "example.amazonaws.com",
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": "13",
    },
    body: "Param1=value1",
    signBody: true,
  });

  assert.equal(
    signatureOf(signed.authorization),
    "d3875051da38690788ef43de4db0d8f280229d82040bfac253562e56c3f20e0b",
  );
});

test("the secret never appears in anything the signer returns", () => {
  // It derives the signing key and stays local. What crosses the wire is the
  // key id, the scope, the signed header names and a hex digest — so a captured
  // request cannot be re-signed for a different one.
  const signed = signRequest({
    ...CREDENTIALS,
    method: "GET",
    url: "https://example.amazonaws.com/",
    headers: { Host: "example.amazonaws.com" },
  });

  assert.ok(!JSON.stringify(signed).includes(CREDENTIALS.secretAccessKey));
});

test("the same request signed a second later is a DIFFERENT signature", () => {
  // Which is why the clock is a parameter. A signer that ignored the time would
  // pass both vectors above and produce a signature valid forever.
  const base = {
    ...CREDENTIALS,
    method: "GET" as const,
    url: "https://example.amazonaws.com/",
    headers: { Host: "example.amazonaws.com" },
  };

  const first = signRequest({ ...base, now: new Date("2015-08-30T12:36:00Z") });
  const later = signRequest({ ...base, now: new Date("2015-08-30T12:36:01Z") });

  assert.notEqual(first.authorization, later.authorization);
});

test("amazon_ses signs with the service and region its manifest declares", () => {
  // The scope line is `<date>/<region>/<service>/aws4_request`, so a wrong
  // region fails as a SIGNATURE error rather than a wrong-endpoint one — which
  // sends whoever reads it looking in entirely the wrong place.
  const signed = signRequest({
    method: "POST",
    url: "https://email.eu-west-1.amazonaws.com/v2/email/outbound-emails",
    headers: { Host: "email.eu-west-1.amazonaws.com" },
    body: "{}",
    accessKeyId: "AKIDEXAMPLE",
    secretAccessKey: "secret",
    region: "eu-west-1",
    service: "ses",
    now: new Date("2015-08-30T12:36:00Z"),
  });

  assert.ok(signed.authorization.includes("/eu-west-1/ses/aws4_request,"), signed.authorization);
});
