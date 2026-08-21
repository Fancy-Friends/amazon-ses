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
 * Send email — Send an email through Amazon SES.
 *
 * https://docs.aws.amazon.com/ses/latest/APIReference-V2/API_SendEmail.html
 *
 * `unsafe-to-replay`.
 */

import type { NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import { defineConnectorKind, summarize, type OutputField } from "@particle-academy/fancy-flow/connectors";
import { amazonSesMeta } from "../service.js";

export const AMAZON_SES_EMAIL_SEND_KIND = "@particle-academy/amazon_ses_email_send";
export const AMAZON_SES_EMAIL_SEND_OPERATION = "email_send";

export const AMAZON_SES_EMAIL_SEND_META = amazonSesMeta("action", "send an email", "https://docs.aws.amazon.com/ses/latest/APIReference-V2/API_SendEmail.html");

/**
 * What this node emits — the "ingredients" a downstream node can reference.
 *
 * fancy-flow reads `outputShape` off the kind and offers it in the variable
 * picker, so declaring it is the whole of the work: an author configuring the
 * next node picks `{{ $json.data.id }}` off a list instead of typing a path
 * and hoping.
 */
export const AMAZON_SES_EMAIL_SEND_OUTPUT: OutputField[] = [
  {
    "path": "mode",
    "type": "string",
    "description": "Which estate this ran against. SES has no separate one, so: fake or live."
  },
  {
    "path": "connection",
    "type": "string",
    "description": "The connection id that was used."
  },
  {
    "path": "data.MessageId",
    "type": "string",
    "description": "SES's id for the send. It means ACCEPTED, not delivered — and in the sandbox an unverified recipient is accepted and discarded."
  }
];

export const amazonSesEmailSendKind: NodeKindDefinition = defineConnectorKind(AMAZON_SES_EMAIL_SEND_META, {
  name: AMAZON_SES_EMAIL_SEND_KIND,
  aliases: ["amazon_ses_email_send"],
  label: "Send email",
  description: "Send an email through Amazon SES.",
  icon: "✉",
  inputs: [{ id: "in" }],
  outputs: [{ id: "out" }],
  sideEffects: "unsafe-to-replay",
  outputShape: AMAZON_SES_EMAIL_SEND_OUTPUT,
  configSchema: [
    {
      "type": "text",
      "key": "from",
      "label": "From",
      "placeholder": "Team <team@yourdomain.com>",
      "description": "Must be a VERIFIED identity in this region. An address verified in another region does not exist here.",
      "required": true
    },
    {
      "type": "expression",
      "key": "to",
      "label": "To",
      "example": "{{ $json.email }}",
      "description": "One address, a comma-separated list, or an expression. While the account is in the SES sandbox, anything not verified is accepted by the API and silently never delivered.",
      "required": true
    },
    {
      "type": "expression",
      "key": "cc",
      "label": "Cc"
    },
    {
      "type": "expression",
      "key": "replyTo",
      "label": "Reply-To"
    },
    {
      "type": "expression",
      "key": "subject",
      "label": "Subject",
      "example": "Your order {{ $json.order_id }}",
      "required": true
    },
    {
      "type": "textarea",
      "key": "text",
      "label": "Plain-text body",
      "rows": 4
    },
    {
      "type": "textarea",
      "key": "html",
      "label": "HTML body",
      "rows": 6
    },
    {
      "type": "text",
      "key": "configurationSet",
      "label": "Configuration set",
      "description": "Optional. SES routes engagement events (bounces, complaints, opens) through the set you name."
    }
  ],
  defaultConfig: {
    "mode": "auto"
  },
  renderBody: ({ config }) =>
    summarize(AMAZON_SES_EMAIL_SEND_META, config as Record<string, unknown>, "send an email"),
});
