fn main(age: u32, vote: pub Field) {
    assert(age >= 18);
    // The vote is recorded publicly, but the exact age is hidden!
}

#[test]
fn test_main() {
    main(25, 1);
}
