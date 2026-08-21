# GENERATED FILE — do not edit.
#
# Emitted from provider/fixtures/ by weaver's generator.
# A hand-edit here is destroyed by the next protocol sync, which is worse than
# being rejected, because it works until it silently does not. Fix
# provider/fixtures/ (or weaver's template/) and regenerate:
#
# npm run provider -- amazon_ses

"""The golden fixtures — the SAME values the TypeScript and PHP packages
assert.

Bit-for-bit identical is the claim, and this is what checks it for Python.
Cross-runtime drift does not fail loudly on its own: it completes, down one
path, with no error.
"""

import pytest

from fancy_amazon_ses._fake import FakeValues, seed_for_call
from fancy_amazon_ses.faker import respond


def test_email_send_fakes_the_published_shape() -> None:
    config = {}
    fake = FakeValues(seed_for_call("amazon_ses", "email_send", config))

    faked = respond("email_send", {"config": config, "fake": fake})

    assert faked == {
        "MessageId": "de630d8a45905e0384533c4b989f99661ddefb5f941a3aa5ba909342b7e8",
    }


def test_an_operation_with_no_fixture_raises_rather_than_inventing_a_shape() -> None:
    fake = FakeValues(seed_for_call("amazon_ses", "no_such_operation", {}))

    with pytest.raises(ValueError, match="no fake response"):
        respond("no_such_operation", {"config": {}, "fake": fake})
