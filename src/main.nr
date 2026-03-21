fn main(
    secret_tx: Field,
    pub_hash: pub Field,
    expected_value: pub Field,
    risk_flag: pub Field
) {
    let computed_hash = secret_tx * secret_tx;
    assert(computed_hash == pub_hash);

    assert(secret_tx == expected_value);

    assert(risk_flag == 1);
}
