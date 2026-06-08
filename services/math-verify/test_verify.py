import verify


def test_equivalent_fraction_and_decimal():
    assert verify.is_equivalent("1/2", "0.5") is True


def test_equivalent_commuted_terms():
    assert verify.is_equivalent("2*x + 3", "3 + 2*x") is True


def test_equivalent_expanded_and_factored():
    assert verify.is_equivalent("(x + 1)**2", "x**2 + 2*x + 1") is True


def test_inequivalent_expressions():
    assert verify.is_equivalent("x + 1", "x + 2") is False


def test_invalid_input_returns_false():
    assert verify.is_equivalent("x +", "x") is False
    assert verify.is_equivalent("", "0") is False


def test_verify_key_wrapper():
    assert verify.verify_key("0.5", "1/2") is True
    assert verify.verify_key("3", "4") is False
