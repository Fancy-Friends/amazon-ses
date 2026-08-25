# Amazon SES

Amazon SES for [fancy-flow][flow] — as **four imported, versioned packages**, one
per runtime. Not vendored source: a copy cannot be upgraded, and third-party APIs
change.

[flow]: https://github.com/Particle-Academy/fancy-flow

| Runtime | Package | Install |
|---|---|---|
| Authoring surface (every host) | `@particle-academy/amazon-ses-ui` | `npm install @particle-academy/amazon-ses-ui` |
| Node | `@particle-academy/amazon-ses-js` | `npm install @particle-academy/amazon-ses-js` |
| PHP 8.4+ | `particle-academy/amazon-ses-php` | `composer require particle-academy/amazon-ses-php` |
| Python 3.11+ | `fancy-amazon-ses` | `pip install fancy-amazon-ses` |

The `ui` package is the editor surface and is React on every host — a PHP or
Python project installs it *and* its own runtime package, and never the `js` one.

## What it costs you

One dependency: `@particle-academy/fancy-connector-core` (or
`particle-academy/fancy-connector-core` on Composer), which the `js` and `php`
packages pull in themselves. The Python package has **zero** runtime
dependencies.

**No Amazon SES SDK.** Plain HTTP, deliberately: a vendor SDK is third-party code
subject to the kit's full approval bar, and one per provider is hundreds of
dependencies nobody is tracking.

## Setting it up

Everything below is generated from `provider/manifest.json`, so it cannot disagree with what the packages do.

### Credentials

A Amazon SES connection holds 3 values.

Every value here is `account` scope: one per connected account, not one per installation.

| Field | Scope | Secret | Where it comes from |
|---|---|---|---|
| **Access key ID** | per connected account | not secret | AKIA... from an IAM user or role with ses:SendEmail. Not secret on its own -- it identifies the key, and the secret below is what proves it. |
| **Secret access key** | per connected account | **secret** | Shown ONCE when the key is created. It is never sent: it derives the signing key, and only the signature goes over the wire. |
| **Region** | per connected account | not secret | Part of the HOST and part of the SIGNATURE, so a mismatch fails as a signature error rather than as a wrong-endpoint one. Verified identities are per-region: a domain verified in us-east-1 does not exist in eu-west-1. |

### The estate

**Amazon SES has NO test estate that can be selected.** Same credentials, same endpoints, same estate — only the AUDIENCE is restricted. A run against it looks completely successful and reaches nobody.

> A new SES account is in the SANDBOX, and it is the reason `restricted-reach` exists as a value. The endpoint is identical, the credentials are identical, the request is identical, and the API answers 200 with a MessageId -- but the mail only reaches addresses you have verified. Anyone else is silently discarded. So a sandbox run looks completely successful and reached nobody, which is why `restricted-reach` cannot be selected as a mode: there is nothing to select. You leave the sandbox by asking AWS for production access, not by pointing at a different host.

## What it can do

### Actions

#### `email_send` — Send email

Send an email through Amazon SES.

`POST /v2/email/outbound-emails` · **unsafe to replay** — a retried durable run does it TWICE

| Input | Required | What it is |
|---|---|---|
| `from` | yes | Must be a VERIFIED identity in this region. An address verified in another region does not exist here. |
| `to` | yes | One address, a comma-separated list, or an expression. While the account is in the SES sandbox, anything not verified is accepted by the API and silently never delivered. |
| `cc` | no | Cc |
| `replyTo` | no | Reply-To |
| `subject` | yes | Subject |
| `text` | no | Plain-text body |
| `html` | no | HTML body |
| `configurationSet` | no | Optional. SES routes engagement events (bounces, complaints, opens) through the set you name. |

## Run it before you have credentials

Every operation ships a **faker**, whether or not Amazon SES has a sandbox. Set a
node's mode to `fake` and it returns the shape Amazon SES actually publishes — the
same field names, deterministically — so you can wire the downstream nodes before
touching an account, a key, or a network.

## This repository is generated

`provider/` is the source. Everything under `packages/` is emitted from it and
**must not be hand-edited** — CI regenerates and diffs on every push, and the
next protocol sync destroys anything it finds. See [`AGENTS.md`](AGENTS.md).

## Two namespaces, which do not match on purpose

The repo is `github.com/Fancy-Friends/amazon-ses`; the packages publish under
`particle-academy`. Nothing derives one from the other — the names come from
weaver's `friends.json` and nowhere else.

## Licence

MIT.
