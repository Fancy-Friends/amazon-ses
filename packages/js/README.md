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
