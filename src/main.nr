// Age verification circuit
// Proves that a student's age (private) is >= the minimum age (public)
// without revealing the actual age
fn main(age: u8, min_age: pub u8) {
    assert(age >= min_age);
}

#[test]
fn test_adult_passes() {
    main(21, 18); // 21 >= 18, should pass
}

#[test]
fn test_exactly_18_passes() {
    main(18, 18); // 18 >= 18, should pass
}

#[test]
fn test_minor_fails() {
    main(16, 18); // 16 < 18, should fail
}
