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
 * Amazon SES's identity on the authoring surface, shared by every Amazon SES
 * node.
 *
 * This file must import nothing from the js package: a PHP or Python project
 * installs the ui package and never that one, and the import would be a
 * dangling module the moment it did.
 *
 * ## The sandbox trap
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

import type { ConnectorMeta } from "@particle-academy/fancy-flow/connectors";

/**
 * The connector API version this package was GENERATED against.
 *
 * A literal, never imported — an imported constant lets an upgrade rewrite the
 * very claim it exists to detect.
 */
export const CONNECTOR_API_VERSION = 1;

/** The parts of a connector's identity that belong to the SERVICE, not the node. */
export const AMAZON_SES_SERVICE = {
  service: "amazon_ses",
  serviceTitle: "Amazon SES",
  domain: "email",
  sandbox: "restricted-reach",
} as const satisfies Pick<ConnectorMeta, "service" | "serviceTitle" | "domain" | "sandbox">;

/** The credentials a Amazon SES connection holds. */
export const AMAZON_SES_CREDENTIALS = [
  {
    "key": "accessKeyId",
    "label": "Access key ID",
    "scope": "account",
    "secret": false,
    "help": "AKIA... from an IAM user or role with ses:SendEmail. Not secret on its own -- it identifies the key, and the secret below is what proves it."
  },
  {
    "key": "secretAccessKey",
    "label": "Secret access key",
    "scope": "account",
    "secret": true,
    "help": "Shown ONCE when the key is created. It is never sent: it derives the signing key, and only the signature goes over the wire."
  },
  {
    "key": "region",
    "label": "Region",
    "scope": "account",
    "secret": false,
    "help": "Part of the HOST and part of the SIGNATURE, so a mismatch fails as a signature error rather than as a wrong-endpoint one. Verified identities are per-region: a domain verified in us-east-1 does not exist in eu-west-1."
  }
] as const;

/** Build a Amazon SES node's connector metadata from the operation it performs. */
export function amazonSesMeta(
  role: ConnectorMeta["role"],
  operation: string,
  docs: string,
): ConnectorMeta {
  return { ...AMAZON_SES_SERVICE, role, operation, docs };
}
