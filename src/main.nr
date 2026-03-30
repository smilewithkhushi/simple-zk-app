//all files to be included here only
fn main(x: u8, y: pub u8) {
    assert(x >= y);
}

#[test]
fn test_main() {
    main(1, 2);

    // Uncomment to make test fail
    // main(1, 1);
}
