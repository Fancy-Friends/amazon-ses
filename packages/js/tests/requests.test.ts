/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- amazon_ses
 */

/**
 * What Amazon SES actually receives.
 *
 * Every assertion below is about the request rather than the response, and
 * none of it touches the network: the transport is a stub that records what it
 * was handed.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import type { PreparedRequest } from "@particle-academy/fancy-connector-core";

import { amazonSesEmailSend } from "../src/actions/email-send.js";

/** Capture the prepared request instead of sending it. */
function capture() {
  const seen: PreparedRequest[] = [];

  return {
    seen,
    transport: async (request: PreparedRequest) => {
      seen.push(request);

      return { status: 200, body: JSON.stringify({ id: "captured" }), headers: {} };
    },
  };
}

const CREDENTIALS = {
  "accessKeyId": "test_accessKeyId",
  "secretAccessKey": "test_secretAccessKey",
  "region": "test_region"
};

test("email_send sends POST /v2/email/outbound-emails", async () => {
  const { seen, transport } = capture();

  await amazonSesEmailSend({
    config: {
      "from": "  Example-from  ",
      "to": "to-one, to-two",
      "cc": "cc-one, cc-two",
      "replyTo": "replyTo-one, replyTo-two",
      "subject": "example-subject",
      "text": "example-text",
      "html": "example-html",
      "configurationSet": "example-configurationSet"
    },
    credentials: CREDENTIALS,
    mode: "live",
    transport,
  });

  assert.equal(seen.length, 1);
  assert.equal(seen[0]!.method, "POST");
  assert.ok(new URL(seen[0]!.url).pathname.endsWith("/v2/email/outbound-emails"), seen[0]!.url);

  assert.deepEqual(JSON.parse(String(seen[0]!.body ?? "{}")), {
    "FromEmailAddress": "Example-from",
    "Destination": {
      "ToAddresses": [
        "to-one",
        "to-two"
      ],
      "CcAddresses": [
        "cc-one",
        "cc-two"
      ]
    },
    "ReplyToAddresses": [
      "replyTo-one",
      "replyTo-two"
    ],
    "Content": {
      "Simple": {
        "Subject": {
          "Data": "example-subject"
        },
        "Body": {
          "Text": {
            "Data": "example-text"
          },
          "Html": {
            "Data": "example-html"
          }
        }
      }
    },
    "ConfigurationSetName": "example-configurationSet"
  });
});

test("the credential is placed the way the provider wants it", async () => {
  const { seen, transport } = capture();

  await amazonSesEmailSend({
    config: {
      "from": "  Example-from  ",
      "to": "to-one, to-two",
      "cc": "cc-one, cc-two",
      "replyTo": "replyTo-one, replyTo-two",
      "subject": "example-subject",
      "text": "example-text",
      "html": "example-html",
      "configurationSet": "example-configurationSet"
    },
    credentials: CREDENTIALS,
    mode: "live",
    transport,
  });

  const auth = String(seen[0]!.headers.Authorization ?? "");
  
  assert.ok(auth.startsWith("AWS4-HMAC-SHA256 Credential=test_accessKeyId/"), auth);
  assert.ok(auth.includes("/test_region/ses/aws4_request,"), auth);
  assert.match(auth, /Signature=[0-9a-f]{64}$/);
  assert.ok(seen[0]!.headers["x-amz-date"], "the signed date was not sent");
  
  // The placeholder has to be gone: a host that still reads
  // "{region}" is a DNS failure, not a signing one, and it
  // sends whoever debugs it somewhere else entirely.
  assert.ok(!seen[0]!.url.includes("{region}"), seen[0]!.url);
  
  // The secret derives the signing key and must NEVER be sent. This is the
  // assertion that would catch a refactor putting it in a header.
  assert.ok(
    !JSON.stringify(seen[0]).includes("test_secretAccessKey"),
    "the SECRET reached the wire",
  );
});

test("a missing required field is refused BEFORE anything is sent", async () => {
  // Nothing was attempted, so there is nothing to classify — and the message names
  // the field, rather than letting the provider answer three frames later with
  // "invalid request".
  const { seen, transport } = capture();

  await assert.rejects(
    amazonSesEmailSend({
      config: {
        "to": "to-one, to-two",
        "cc": "cc-one, cc-two",
        "replyTo": "replyTo-one, replyTo-two",
        "subject": "example-subject",
        "text": "example-text",
        "html": "example-html",
        "configurationSet": "example-configurationSet"
      },
      credentials: CREDENTIALS,
      mode: "live",
      transport,
    }),
    new RegExp("from"),
  );

  assert.equal(seen.length, 0, "the request must not have been sent");
});
