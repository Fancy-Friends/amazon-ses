/**
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
 * @particle-academy/fancy-connector-core carries what is true of ALL
 * connectors. This carries what is true of Amazon SES: its base URL, its auth
 * scheme, its idempotency header, and its faker.
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

import type { ConnectorMode, PreparedRequest, ServiceDescriptor } from "@particle-academy/fancy-connector-core";

import { amazonSesFaker } from "./faker.js";
import { signRequest } from "./sigv4.js";

/**
 * The connector API version this package was GENERATED against.
 *
 * A literal, never imported. An imported constant lets an upgrade rewrite the
 * very claim it exists to detect, after which the copy agrees with itself
 * forever.
 */
export const CONNECTOR_API_VERSION = 1;

export const AMAZON_SES_BASE_URLS = {
  "live": "https://email.{region}.amazonaws.com",
  "$comment": "The host carries the REGION, which is a per-connection credential rather than a constant. Every provider before this one had a base URL that was the same string for everybody."
} as const;

/** Credential keys a remote call cannot proceed without. */
export const AMAZON_SES_REQUIRES = [
  "accessKeyId",
  "secretAccessKey",
  "region"
] as const;

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
 * The mode is passed in because for some providers auth and estate are the
 * same decision expressed in the URL; here it is unused, and saying so is
 * cheaper than wondering later whether it was forgotten.
 */
export function amazonSesAuthorize(
  credentials: Record<string, string | undefined>,
  request: PreparedRequest,
  _mode: ConnectorMode,
): void {
  request.url = request.url.replace("{region}", String(credentials.region ?? ""));

  const { host } = new URL(request.url);
  const signed = signRequest({
    method: request.method,
    url: request.url,
    headers: { ...request.headers, host },
    body: request.body,
    accessKeyId: credentials.accessKeyId ?? "",
    secretAccessKey: credentials.secretAccessKey ?? "",
    region: credentials.region ?? "",
    service: "ses",
  });

  // `host` is SIGNED but not carried: it is a forbidden header for fetch,
  // which sets it from the URL. Assigning it here would be rejected, and
  // omitting it from the signature would be a mismatch.
  request.headers["x-amz-date"] = signed.amzDate;
  request.headers["x-amz-content-sha256"] = String(signed.headers["x-amz-content-sha256"]);
  request.headers.Authorization = signed.authorization;
}

/** The Amazon SES service, for the TypeScript runtime. */
export const AMAZON_SES: ServiceDescriptor = {
  service: "amazon_ses",
  title: "Amazon SES",
  sandbox: "restricted-reach",
  baseUrls: { ...AMAZON_SES_BASE_URLS },
  requires: [...AMAZON_SES_REQUIRES],
  authorize: amazonSesAuthorize,
  faker: amazonSesFaker,
};
