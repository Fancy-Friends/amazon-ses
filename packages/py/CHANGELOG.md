# Changelog

All notable changes to `@particle-academy/amazon-ses-ui`,
`@particle-academy/amazon-ses-js`, `particle-academy/amazon-ses-php` and
`fancy-amazon-ses`.

The four packages share one version, because they are generated from one
`provider/` definition and a version that meant something different in each
would be a version nobody could reason about.

## [0.3.3] — 2026-09-11

### Added

- **`fancy-flow-php` executors for every node.** `src/Flow/` carries one `#[FlowNode]` class per action and trigger, and `AmazonSesFlow::EXECUTORS` lists them.

A Laravel host running fancy-flow-php could show this connector's nodes in its editor and could not run them: `particle-academy/amazon-ses-php` shipped the request builders and no executor. Each one is the PHP twin of the executor in `@particle-academy/amazon-ses-js` — the same kind, the same request, the same value on `out` — and an unsafe-to-replay action derives its idempotency key from the run and the node, so a retried durable run sends the key it sent the first time.

Register them by adding `vendor/particle-academy/amazon-ses-php/packages/php/src/Flow` to `config('fancy-flow.discover')`. `particle-academy/fancy-flow-php` is SUGGESTED, not required, and conflicts outside `>=0.51.0 <2.0`, the range the executors were tested under. Nothing outside `Flow\` needs it.

### Fixed

- **Fake mode through `ConnectorClient` threw.** `AmazonSes::descriptor()` handed the connector core its faker as `AmazonSesFaker::respond(...)`, which takes `($operation, $request)`; the core calls a faker `($operation, $config, $fake, $input)`. So `$config` arrived as `$request` and every fake call died on "Call to a member function … on null". The descriptor now translates between the two. Calling `AmazonSesFaker::respond()` directly — what this package's own tests do, which is why they never saw it — is unchanged.

- **`AmazonSes::descriptor()` was a fatal error, in every mode.** A `$comment` note inside the manifest's `baseUrls` was emitted as `Mode::Comment->value`, and `Mode` has no such case. The TypeScript package carried the same note as a base URL for a mode called `$comment`; it is gone from `AMAZON_SES_BASE_URLS`.

- **SigV4 could not be autoloaded.** `src/SigV4.php` declared `ParticleAcademy\Connectors`, the connector core's namespace, so composer looked for the class inside `fancy-connector-core` and found nothing: every live request failed on "class not found" before it was signed. It is `ParticleAcademy\AmazonSes\SigV4` now.

## [0.3.2] — 2026-09-06

### Changed

- **Published through npm Trusted Publishing, so these packages now carry PROVENANCE.**

Every earlier release went out under a scope-wide npm token. This one is
published by an OIDC exchange from the release workflow itself, and npm records
which workflow in which repository built it.
`npm view @particle-academy/amazon-ses-ui@0.3.2` shows the attestation; releases before
this one have none.

What it buys a consumer: the tarball on the registry can be tied to a public
commit and a public workflow run, rather than to whoever held a token. What it
does not buy: nothing about the code changed, and the runtime behaviour of all
four packages is identical to 0.3.1.

- **`repository.directory` in the npm packages.**

`@particle-academy/amazon-ses-ui` and `@particle-academy/amazon-ses-js` live at
`packages/ui` and `packages/js` inside the provider repo. npm's `repository`
field now says so, which makes the "Repository" link on each package page point
at the package rather than at the repository root.

## [0.3.1] — 2026-08-24

### Fixed

- **`@particle-academy/amazon-ses-js` now accepts a RANGE of `@particle-academy/amazon-ses-ui`, not one exact version.**

It peer-depended on `@particle-academy/amazon-ses-ui` at exactly the release it shipped with. That is the
strict form of the thing the kit's own rule forbids — a first-party sibling gets
a range — and the same block applied the rule correctly to its other two
dependencies. It was this one pair that slipped.

What it cost: ship `@particle-academy/amazon-ses-ui` with a fixed help string and every consumer on the
previous `@particle-academy/amazon-ses-js` had an **unmet peer**, which npm 7+ errors on. A documentation
patch could not be delivered without a matching runtime release, and a routine
`npm update` that moved the ui package alone broke the install.

The coupling is real and is not being loosened away. The ui package emits the
config schema and the js package implements against it, so a ui that adds a
field to a js that ignores it is silently wrong. But a PATCH is non-additive by
definition and a MINOR is where a field can appear — so `>=0.3.1 <0.4.0` is the
coupling that actually exists rather than the strictest one expressible.

Nothing else changed. `particle-academy/amazon-ses-php` and `fancy-amazon-ses` are unaffected; neither has an
equivalent edge.

## [0.3.0] — 2026-08-24

### Added

- **The README now says how to SET THIS CONNECTOR UP**, in the package itself.

Until now it explained what the four packages are, what they cost and why the
repo is generated — and said nothing about credentials, scopes, sandboxes or
operations. Somebody who installed it could not learn from it which credentials
a connection needs, where a human GETS them, which scopes to request, or what
the connector can actually do. All of that was already in the definition; the
one document a consumer reads was the one that omitted everything actionable.

The new **Setting it up** section carries:

- every credential, with the text saying where the value comes from, whether it
  is **per installation** or **per connected account**, and whether it is secret;
- the OAuth authorize and token URLs and the exact scopes, verbatim;
- the access-token lifetime, and where refresh tokens ROTATE, the two things a
  host must not do — retry a failed refresh, or refresh concurrently — because a
  replay revokes the entire grant and nothing in the failure says why;
- the estate in this provider's own terms, including the cases where a
  successful-looking run reaches nobody, or reaches the real one;
- every action and trigger with its method, path, inputs, and whether it is safe
  to replay;
- a trigger's provider-side setup, which nobody can derive from anything else.

It is **generated from `provider/manifest.json`**, so it cannot drift from what
the packages do — which is the point at a few hundred providers, where a
hand-written setup section is a few hundred documents going quietly stale.

No code changed. This release exists because a registry and an installing agent
read the PUBLISHED artifact, and the artifact carried the old README.

## [0.2.0] — 2026-08-24

### Changed

- **`@particle-academy/amazon-ses-ui` is now an OPTIONAL PEER dependency of `@particle-academy/amazon-ses-js`, not a hard one.**

`./flow` needs it; nothing else does. It was a hard dependency, and because
`@particle-academy/amazon-ses-ui` itself peer-depends on `fancy-flow` — which npm 7+ installs
automatically — `npm install @particle-academy/amazon-ses-js` pulled the **entire flow engine**
onto disk for a consumer who only wanted to call the API. Roughly **18 MB
became 874 KB**, and the package works exactly as before:

```js
import { amazonSes… } from "@particle-academy/amazon-ses-js";
// an injected transport, no flow engine anywhere
```

**This is breaking if you use `@particle-academy/amazon-ses-js/flow`.** Add `@particle-academy/amazon-ses-ui` to your own
dependencies — it was always being installed for you, and now it is declared.
Everything importing only the main entry point is unaffected.

The fix is on this edge rather than on `@particle-academy/amazon-ses-ui` → `fancy-flow`: the ui package
genuinely requires fancy-flow, since it calls `defineConnectorKind`, and marking
that peer optional would be a lie about what it needs.

## [0.1.0] — 2026-08-20

First release. Provider five, and the first whose requests are **signed**
rather than presented.

### Added

- `email_send` — send an email. `POST /v2/email/outbound-emails`.
- AWS **Signature Version 4** signing, pinned against AWS's own published test
  vectors.
- A faker for it, so the node runs on a canvas with no AWS account.

### Why SES, and not the next name on the list

Every provider before this one presents a static credential: a bearer token, a
header, a path segment. SES **signs**. The method, the path, the query, the
headers and a hash of the body go into a canonical form, which is hashed and
HMAC'd with a key derived in four steps from the secret, the date, the region
and the service.

Every fact here is read from **AWS's own service model**
(`botocore/data/sesv2/2019-09-27/service-2.json`), not from memory: the
endpoint, the path, the request shape, the response shape, and
`signatureVersion: v4` with `signingName: ses`.

### `restricted-reach` — the value that existed and had never been used

A new SES account is in the **sandbox**, and it is the reason that value is in
the vocabulary. The endpoint is identical, the credentials are identical, the
request is identical, and the API answers **200 with a MessageId** — but the
mail only reaches addresses you have verified. Everyone else is silently
discarded.

So a sandbox run looks completely successful and reached nobody, which is why
`restricted-reach` **cannot be selected as a mode**: there is nothing to
select. You leave the sandbox by asking AWS for production access, not by
pointing at a different host.

`MessageId` therefore means **accepted**, not delivered. That distinction is in
the output shape rather than left to be discovered.

### Three other firsts

- **A base URL that is not the same string for everybody.** The host carries
  the region (`https://email.{region}.amazonaws.com`), which is a
  per-connection credential. The placeholder is checked against the declared
  credentials — and refused if it names a secret, because a host is recorded by
  every proxy and error reporter between here and the provider.
- **A five-level nested body.** `Content.Simple.Body.Text.Data` is deeper than
  anything HubSpot needed, and it is what proves the nesting is arbitrary-depth
  rather than one level.
- **A signer that reads the clock.** A signature is only valid for a window, so
  the time is an argument rather than a call to `now()` — otherwise the
  signature could not be tested for a fixed answer.

### On not taking a dependency

The AWS SDK is enormous and would be one SDK per provider at scale. SigV4 is
about eighty lines in each language, it is pinned against AWS's own vectors,
and it is the same algorithm for every AWS service — so the next one costs
nothing.

[0.1.0]: https://github.com/Fancy-Friends/amazon-ses/releases/tag/v0.1.0
[0.2.0]: https://github.com/Fancy-Friends/amazon-ses/releases/tag/v0.2.0
[0.3.0]: https://github.com/Fancy-Friends/amazon-ses/releases/tag/v0.3.0
[0.3.1]: https://github.com/Fancy-Friends/amazon-ses/releases/tag/v0.3.1
