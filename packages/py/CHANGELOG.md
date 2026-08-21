# Changelog

All notable changes to `@particle-academy/amazon-ses-ui`,
`@particle-academy/amazon-ses-js`, `particle-academy/amazon-ses-php` and
`fancy-amazon-ses`.

The four packages share one version, because they are generated from one
`provider/` definition and a version that meant something different in each
would be a version nobody could reason about.

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
