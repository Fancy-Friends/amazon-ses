/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/manifest.json (via weaver's template/embed/ts/sigv4.ts) by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/manifest.json (via weaver's template/embed/ts/sigv4.ts) (or weaver's template/) and regenerate:
 *
 *     npm run provider -- amazon_ses
 */

/**
 * AWS Signature Version 4.
 *
 * Every other provider in this kit PRESENTS a credential — a bearer token, a
 * header, a path segment. This one SIGNS: the method, the path, the query, the
 * headers and a hash of the body go into a canonical form, which is hashed and
 * HMAC'd with a key derived in four steps from the secret, the date, the region
 * and the service.
 *
 * ## Why the clock is a parameter
 *
 * A signature is only valid for a window, so this reads the time — and a
 * function that reads the clock cannot be tested for a fixed answer. `now` is
 * therefore an argument, defaulted, and the tests pin it to the timestamp in
 * AWS's own published vectors. Nothing else here is non-deterministic.
 *
 * ## Why the secret never appears in the request
 *
 * It derives the signing key and stays local. What crosses the wire is the
 * access key id, the scope, the list of signed header names and a hex digest —
 * so a captured request cannot be re-signed for a different one.
 */
import { createHash, createHmac } from "node:crypto";

export type SignInput = {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string | undefined;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  service: string;
  /** Defaulted so callers need not think about it; injected so tests can. */
  now?: Date;
  /**
   * Add `x-amz-content-sha256` and sign it.
   *
   * AWS's own test suite carries this as a flag, and the two vectors this is
   * pinned against differ by exactly it. Services taking a body want it.
   */
  signBody?: boolean;
};

export type Signature = {
  authorization: string;
  amzDate: string;
  /** Every header the signature covers, ready to merge into the request. */
  headers: Record<string, string>;
};

const ALGORITHM = "AWS4-HMAC-SHA256";

export function signRequest(input: SignInput): Signature {
  const now = input.now ?? new Date();
  const amzDate = `${stamp(now)}T${clock(now)}Z`;
  const dateStamp = stamp(now);
  const url = new URL(input.url);

  const payload = input.body ?? "";
  const payloadHash = sha256(payload);

  const headers: Record<string, string> = { ...input.headers, "x-amz-date": amzDate };
  if (input.signBody !== false) headers["x-amz-content-sha256"] = payloadHash;

  // Lowercased, trimmed, inner whitespace collapsed, sorted by name. The order
  // is part of what is signed, so "the same headers in a different order" is a
  // different signature.
  const canonicalHeaderNames = Object.keys(headers)
    .map((name) => name.toLowerCase())
    .sort();
  const byLowerName = new Map(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));

  const canonicalHeaders = canonicalHeaderNames
    .map((name) => `${name}:${String(byLowerName.get(name) ?? "").trim().replace(/\s+/g, " ")}\n`)
    .join("");
  const signedHeaders = canonicalHeaderNames.join(";");

  const canonicalQuery = [...url.searchParams.entries()]
    .map(([k, v]) => [rfc3986(k), rfc3986(v)] as const)
    .sort((a, b) => (a[0] === b[0] ? compare(a[1], b[1]) : compare(a[0], b[0])))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const canonicalRequest = [
    input.method.toUpperCase(),
    url.pathname || "/",
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const scope = `${dateStamp}/${input.region}/${input.service}/aws4_request`;
  const stringToSign = [ALGORITHM, amzDate, scope, sha256(canonicalRequest)].join("\n");

  // Four steps, each keyed by the last. This is what makes a signature usable
  // only for one date, one region and one service.
  const kDate = hmac(`AWS4${input.secretAccessKey}`, dateStamp);
  const kRegion = hmac(kDate, input.region);
  const kService = hmac(kRegion, input.service);
  const kSigning = hmac(kService, "aws4_request");
  const signature = hmac(kSigning, stringToSign).toString("hex");

  return {
    amzDate,
    headers,
    authorization:
      `${ALGORITHM} Credential=${input.accessKeyId}/${scope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

/** The signature alone, which is what AWS's published vectors assert. */
export function signatureOf(authorization: string): string {
  return authorization.slice(authorization.indexOf("Signature=") + "Signature=".length);
}

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function hmac(key: string | Buffer, value: string): Buffer {
  return createHmac("sha256", key).update(value, "utf8").digest();
}

function stamp(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

function clock(date: Date): string {
  return date.toISOString().slice(11, 19).replace(/:/g, "");
}

/**
 * RFC 3986, which is NOT what `encodeURIComponent` does.
 *
 * It leaves `!'()*` alone, and AWS expects them percent-encoded. A query
 * containing one signs differently from the request that is actually sent, and
 * the failure arrives as a signature mismatch that says nothing about quoting.
 */
function rfc3986(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** Byte order, not locale order — `localeCompare` sorts differently per ICU build. */
function compare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
