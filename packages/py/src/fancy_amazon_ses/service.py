# GENERATED FILE — do not edit.
#
# Emitted from provider/manifest.json by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/manifest.json (or weaver's template/) and regenerate:
#
# npm run provider -- amazon_ses

"""Amazon SES, as one service descriptor shared by every Amazon SES operation.

The Python twin of the js and php packages' service modules.

## The sandbox trap, written down where it is used

A new SES account is in the SANDBOX, and it is the reason `restricted-reach`
exists as a value. The endpoint is identical, the credentials are identical,
the request is identical, and the API answers 200 with a MessageId -- but
the mail only reaches addresses you have verified. Anyone else is silently
discarded. So a sandbox run looks completely successful and reached nobody,
which is why `restricted-reach` cannot be selected as a mode: there is
nothing to select. You leave the sandbox by asking AWS for production
access, not by pointing at a different host.
"""

from __future__ import annotations

from ._runtime import PreparedRequest, ServiceDescriptor
from ._sigv4 import sign_request
from .faker import respond

# The connector API version this package was GENERATED against. A literal,
# never imported: an imported constant lets an upgrade rewrite the very claim
# it exists to detect, after which the copy agrees with itself forever.
CONNECTOR_API_VERSION = 1

SERVICE = "amazon_ses"
TITLE = "Amazon SES"
SANDBOX = "restricted-reach"
BASE_URLS = {
    "live": "https://email.{region}.amazonaws.com",
}

"""Credential keys a remote call cannot proceed without."""
REQUIRES = [
    "accessKeyId",
    "secretAccessKey",
    "region",
]


def authorize(
    credentials: dict[str, str | None],
    request: PreparedRequest,
    mode: str,
) -> None:
    """Apply Amazon SES's auth scheme to an outgoing request.
    
    Signature Version 4, read from AWS's own service model
    (metadata.signatureVersion = v4, signingName = ses). Not a header holding a
    key: the request is SIGNED, so the method, the path, the query, the headers
    and a hash of the body all go into a canonical form that is HMAC'd with a
    key derived from the secret, the date, the region and the service. Nothing
    else in this kit signs a request -- every provider so far presents a static
    credential.
    """
    import urllib.parse

    request.url = request.url.replace("{region}", str(credentials.get("region") or ''))
    host = urllib.parse.urlsplit(request.url).netloc

    signed = sign_request(
        request.method,
        request.url,
        {**request.headers, 'host': host},
        request.body.decode() if isinstance(request.body, bytes) else request.body,
        str(credentials.get("accessKeyId") or ''),
        str(credentials.get("secretAccessKey") or ''),
        str(credentials.get("region") or ''),
        "ses",
    )

    # `host` is SIGNED but not carried: the transport sets it from the
    # URL, and omitting it from the signature would be a mismatch.
    request.headers['x-amz-date'] = signed['amzDate']
    request.headers['x-amz-content-sha256'] = str(signed['headers']['x-amz-content-sha256'])
    request.headers['Authorization'] = signed['authorization']


def descriptor() -> ServiceDescriptor:
    """The Amazon SES service, for the Python runtime."""
    return ServiceDescriptor(
        service=SERVICE,
        title=TITLE,
        sandbox=SANDBOX,
        base_urls=BASE_URLS,
        requires=REQUIRES,
        authorize=authorize,
        faker=respond,
        idempotency_header=None,
    )
