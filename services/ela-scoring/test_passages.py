import passages


def test_commonlit_is_blocked():
    p = passages.Passage("X", "...", "CommonLit", "CommonLit Terms")
    assert passages.is_allowed(p) is False


def test_public_domain_allowed():
    p = passages.Passage(
        "Aesop", "The Fox and the Grapes...", "Project Gutenberg", "Public Domain"
    )
    assert passages.is_allowed(p) is True


def test_ck12_allowed():
    p = passages.Passage("Cells", "...", "CK-12", "CC-BY-NC")
    assert passages.is_allowed(p) is True
