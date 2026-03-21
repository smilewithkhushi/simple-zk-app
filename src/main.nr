//all files to be included here only
fn main(x: u8, y: pub u8) {
    assert(x == y);
    assert(y <= 100);
}

#[test]
fn test_main() {
    main(42, 42);

    // Uncomment to make test fail
    // main(101, 101);
}
