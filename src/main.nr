//all files to be included here only
fn main(x: Field, y: pub Field) {
    // Prove equality and that y is in [1, 100]
    assert(x == y);
    let y_int: u32 = y as u32;
    assert(y_int >= 1u32);
    assert(y_int <= 100u32);
}

#[test]
fn test_main() {
    main(1, 1);

    // Uncomment to make test fail
    // main(1, 1);
}
