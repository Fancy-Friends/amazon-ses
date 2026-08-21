# GENERATED FILE — do not edit.
#
# Emitted from provider/manifest.json (via weaver's
# template/embed/py/_sigv4.py) by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/manifest.json (via weaver's template/embed/py/_sigv4.py) (or
# weaver's template/) and regenerate:
#
# npm run provider -- amazon_ses

"""AWS Signature Version 4 -- the Python twin of the TypeScript and PHP signers.

Every other provider in this kit PRESENTS a credential. This one SIGNS: the
method, the path, the query, the headers and a hash of the body go into a
canonical form, which is hashed and HMAC'd with a key derived in four steps from
the secret, the date, the region and the service.

The three implementations are pinned against AWS's OWN published test vectors,
not against each other. Three copies that agree prove they are consistent; only
an external vector proves they are right.

The clock is a parameter because a function that reads it cannot be tested for a
fixed answer. The secret never leaves this module -- it derives the signing key,
and what crosses the wire is the key id, the scope, the signed header names and
a hex digest.
"""

from __future__ import annotations

import hashlib
import hmac
import re
import time
import urllib.parse
from typing import Any

ALGORITHM = "AWS4-HMAC-SHA256"

_WHITESPACE = re.compile(r"\s+")


def sign_request(
    method: str,
    url: str,
    headers: dict[str, str],
    body: str | None,
    access_key_id: str,
    secret_access_key: str,
    region: str,
    service: str,
    now: int | None = None,
    sign_body: bool = True,
) -> dict[str, Any]:
    """Sign one request. Returns the Authorization header and everything it covers."""
    timestamp = time.gmtime(now if now is not None else time.time())
    amz_date = time.strftime("%Y%m%dT%H%M%SZ", timestamp)
    date_stamp = time.strftime("%Y%m%d", timestamp)

    payload = body or ""
    payload_hash = hashlib.sha256(payload.encode()).hexdigest()

    headers = dict(headers)
    headers["x-amz-date"] = amz_date
    if sign_body:
        headers["x-amz-content-sha256"] = payload_hash

    # Lowercased, trimmed, inner whitespace collapsed, sorted by name. The order
    # is part of what is signed, so the same headers in a different order are a
    # different signature.
    canonical = {k.lower(): _WHITESPACE.sub(" ", str(v).strip()) for k, v in headers.items()}
    names = sorted(canonical)

    canonical_headers = "".join(f"{name}:{canonical[name]}\n" for name in names)
    signed_headers = ";".join(names)

    parts = urllib.parse.urlsplit(url)
    pairs = sorted(
        (urllib.parse.quote(k, safe="-_.~"), urllib.parse.quote(v, safe="-_.~"))
        for k, v in urllib.parse.parse_qsl(parts.query, keep_blank_values=True)
    )
    canonical_query = "&".join(f"{k}={v}" for k, v in pairs)

    canonical_request = "\n".join(
        [
            method.upper(),
            parts.path or "/",
            canonical_query,
            canonical_headers,
            signed_headers,
            payload_hash,
        ]
    )

    scope = f"{date_stamp}/{region}/{service}/aws4_request"
    string_to_sign = "\n".join(
        [
            ALGORITHM,
            amz_date,
            scope,
            hashlib.sha256(canonical_request.encode()).hexdigest(),
        ]
    )

    # Four steps, each keyed by the last -- which is what makes a signature
    # usable only for one date, one region and one service.
    k_date = _hmac(f"AWS4{secret_access_key}".encode(), date_stamp)
    k_region = _hmac(k_date, region)
    k_service = _hmac(k_region, service)
    k_signing = _hmac(k_service, "aws4_request")
    signature = _hmac(k_signing, string_to_sign).hex()

    return {
        "amzDate": amz_date,
        "headers": headers,
        "authorization": (
            f"{ALGORITHM} Credential={access_key_id}/{scope}, "
            f"SignedHeaders={signed_headers}, Signature={signature}"
        ),
    }


def signature_of(authorization: str) -> str:
    """The signature alone, which is what AWS's published vectors assert."""
    marker = "Signature="

    return authorization[authorization.index(marker) + len(marker) :]


def _hmac(key: bytes, value: str) -> bytes:
    return hmac.new(key, value.encode(), hashlib.sha256).digest()
