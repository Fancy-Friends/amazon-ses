/**
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
 * Notice what is NOT here: no key, no base URL, no mode check, no retry loop,
 * no fake/real branch. This describes the request; callConnector resolves the
 * connection, picks the estate, and either calls Amazon SES or calls the
 * faker.
 *
 * sideEffects: unsafe-to-replay.
 */

import {
  callConnector,
  type ConnectorResult,
  type RequestedMode,
  type Transport,
} from "@particle-academy/fancy-connector-core";
import { AMAZON_SES } from "../service.js";

export const EMAIL_SEND_OPERATION = "email_send";

export type EmailSendOptions = {
  /** The node's resolved config. Keys: from, to, cc, replyTo, subject, text, html, configurationSet. */
  config: Record<string, unknown>;
  credentials?: Record<string, string | undefined>;
  mode?: RequestedMode;
  connectionId?: string | null;
  input?: unknown;
  attempts?: number;
  /** Override the transport. The only way to exercise this without a network. */
  transport?: Transport;
};

export async function amazonSesEmailSend(options: EmailSendOptions): Promise<ConnectorResult> {
  const config = options.config ?? {};

  if (config.from === undefined || config.from === null || config.from === "") {
    throw new Error(`email_send: "from" is required (From).`);
  }

  if (config.to === undefined || config.to === null || config.to === "") {
    throw new Error(`email_send: "to" is required (To).`);
  }

  if (config.subject === undefined || config.subject === null || config.subject === "") {
    throw new Error(`email_send: "subject" is required (Subject).`);
  }

  if (!((config.text !== undefined && config.text !== null && config.text !== "") || (config.html !== undefined && config.html !== null && config.html !== ""))) {
    throw new Error(`email_send: needs a "text" or "html" body — SES refuses a Content.Simple with neither, and an empty email is never intended.`);
  }

  return callConnector(AMAZON_SES, {
    operation: EMAIL_SEND_OPERATION,
    config,
    input: options.input,
    ...(options.credentials === undefined ? {} : { credentials: options.credentials }),
    ...(options.mode === undefined ? {} : { mode: options.mode }),
    ...(options.connectionId === undefined ? {} : { connectionId: options.connectionId }),
    ...(options.attempts === undefined ? {} : { attempts: options.attempts }),
    ...(options.transport === undefined ? {} : { transport: options.transport }),
    request: {
      method: "POST",
      path: "/v2/email/outbound-emails",
      json: nestFields({
        "FromEmailAddress": String(config.from).trim(),
        "Destination.ToAddresses": destinationToaddressesList(config.to),
        ...(config.cc !== undefined && config.cc !== null && config.cc !== "" ? { "Destination.CcAddresses": destinationCcaddressesList(config.cc) } : {}),
        ...(config.replyTo !== undefined && config.replyTo !== null && config.replyTo !== "" ? { "ReplyToAddresses": replytoaddressesList(config.replyTo) } : {}),
        "Content.Simple.Subject.Data": String(config.subject),
        ...(config.text !== undefined && config.text !== null && config.text !== "" ? { "Content.Simple.Body.Text.Data": String(config.text) } : {}),
        ...(config.html !== undefined && config.html !== null && config.html !== "" ? { "Content.Simple.Body.Html.Data": String(config.html) } : {}),
        ...(config.configurationSet !== undefined && config.configurationSet !== null && config.configurationSet !== "" ? { "ConfigurationSetName": String(config.configurationSet) } : {}),
      }),
    },
  });
}

/**
 * `{"properties.email": x}` -> `{properties: {email: x}}`.
 *
 * A dotted `as` means NESTING, and only a JSON body can nest. The validator
 * refuses that spelling anywhere else, because in a form body it already means
 * something different — a literal dotted key.
 */
function nestFields(flat: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [path, value] of Object.entries(flat)) {
    const parts = path.split(".");
    let node = out;

    while (parts.length > 1) {
      const key = parts.shift() as string;

      if (typeof node[key] !== "object" || node[key] === null) node[key] = {};
      node = node[key] as Record<string, unknown>;
    }

    node[parts[0] as string] = value;
  }

  return out;
}

/** One value, a ","-separated string, or an array — all end up a list. */
function destinationToaddressesList(value: unknown): string[] {
  const items = Array.isArray(value)
    ? value.map(String)
    : typeof value === "string"
      ? value.split(",")
      : [];

  return items.map((item) => item.trim()).filter(Boolean);
}

/** One value, a ","-separated string, or an array — all end up a list. */
function destinationCcaddressesList(value: unknown): string[] {
  const items = Array.isArray(value)
    ? value.map(String)
    : typeof value === "string"
      ? value.split(",")
      : [];

  return items.map((item) => item.trim()).filter(Boolean);
}

/** One value, a ","-separated string, or an array — all end up a list. */
function replytoaddressesList(value: unknown): string[] {
  const items = Array.isArray(value)
    ? value.map(String)
    : typeof value === "string"
      ? value.split(",")
      : [];

  return items.map((item) => item.trim()).filter(Boolean);
}
