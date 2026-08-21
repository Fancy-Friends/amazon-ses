# GENERATED FILE — do not edit.
#
# Emitted from provider/actions/email-send.json by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/actions/email-send.json (or weaver's template/) and regenerate:
#
# npm run provider -- amazon_ses

"""Send an email through Amazon SES.

POST /v2/email/outbound-emails —
https://docs.aws.amazon.com/ses/latest/APIReference-V2/API_SendEmail.html

This describes the request. `call` resolves the connection, picks the
estate, and either calls Amazon SES or calls the faker.
"""

from __future__ import annotations

from typing import Any

from .._runtime import CallResult, ConnectorConfigError, Mode, call
from ..service import descriptor

OPERATION = "email_send"
METHOD = "POST"
PATH = "/v2/email/outbound-emails"
SIDE_EFFECTS = "unsafe-to-replay"


def body(config: dict[str, Any]) -> dict[str, Any]:
    """Build the JSON body for one call, failing loudly and specifically."""
    if config.get("from") is None or config.get("from") == "":
        raise ConnectorConfigError(
            "email_send: \"from\" is required (From)."
        )

    if config.get("to") is None or config.get("to") == "":
        raise ConnectorConfigError(
            "email_send: \"to\" is required (To)."
        )

    if config.get("subject") is None or config.get("subject") == "":
        raise ConnectorConfigError(
            "email_send: \"subject\" is required (Subject)."
        )

    if not (
        (config.get("text") is not None and config.get("text") != "")
        or (config.get("html") is not None and config.get("html") != "")
    ):
        raise ConnectorConfigError(
            "email_send: needs a \"text\" or \"html\" body — SES refuses a Content.Simple with "
            "neither, and an empty email is never intended."
        )

    out: dict[str, Any] = {}
    _value = config.get("from")
    if _value is None or _value == "":
        raise ConnectorConfigError("email_send: \"from\" is required.")

    out["FromEmailAddress"] = str(_value).strip()
    _value = config.get("to")
    out["Destination.ToAddresses"] = _destination_toaddresses_list(config.get("to"))
    _value = config.get("cc")
    if _value is not None and _value != "":
        out["Destination.CcAddresses"] = _destination_ccaddresses_list(config.get("cc"))
    _value = config.get("replyTo")
    if _value is not None and _value != "":
        out["ReplyToAddresses"] = _replytoaddresses_list(config.get("replyTo"))
    _value = config.get("subject")
    if _value is None or _value == "":
        raise ConnectorConfigError("email_send: \"subject\" is required.")

    out["Content.Simple.Subject.Data"] = str(_value)
    _value = config.get("text")
    if _value is not None and _value != "":
        out["Content.Simple.Body.Text.Data"] = str(_value)
    _value = config.get("html")
    if _value is not None and _value != "":
        out["Content.Simple.Body.Html.Data"] = str(_value)
    _value = config.get("configurationSet")
    if _value is not None and _value != "":
        out["ConfigurationSetName"] = str(_value)

    return _nest_fields(out)


def email_send(
    config: dict[str, Any],
    *,
    credentials: dict[str, str | None] | None = None,
    mode: Mode = "auto",
    connection_id: str | None = None,
    attempts: int = 3,
) -> CallResult:
    """Send an email through Amazon SES."""
    return call(
        descriptor(),
        operation=OPERATION,
        method=METHOD,
        path=PATH,
        json_body=body(config),
        config=config,
        credentials=credentials,
        mode=mode,
        connection_id=connection_id,
        attempts=attempts,
    )



def _nest_fields(flat: dict[str, Any]) -> dict[str, Any]:
    """`{"properties.email": x}` -> `{"properties": {"email": x}}`.

    A dotted `as` means NESTING, and only a JSON body can nest -- in a form body
    that spelling already means a literal dotted key.
    """
    out: dict[str, Any] = {}

    for path, value in flat.items():
        parts = path.split(".")
        node = out

        for key in parts[:-1]:
            found = node.get(key)
            if not isinstance(found, dict):
                found = {}
                node[key] = found
            node = found

        node[parts[-1]] = value

    return out

def _destination_toaddresses_list(value: Any) -> list[str]:
    """One value, a ","-separated string, or a list — all end up a list."""
    if isinstance(value, list):
        items = [str(item) for item in value]
    elif isinstance(value, str):
        items = value.split(",")
    else:
        return []

    return [item.strip() for item in items if item.strip()]

def _destination_ccaddresses_list(value: Any) -> list[str]:
    """One value, a ","-separated string, or a list — all end up a list."""
    if isinstance(value, list):
        items = [str(item) for item in value]
    elif isinstance(value, str):
        items = value.split(",")
    else:
        return []

    return [item.strip() for item in items if item.strip()]

def _replytoaddresses_list(value: Any) -> list[str]:
    """One value, a ","-separated string, or a list — all end up a list."""
    if isinstance(value, list):
        items = [str(item) for item in value]
    elif isinstance(value, str):
        items = value.split(",")
    else:
        return []

    return [item.strip() for item in items if item.strip()]