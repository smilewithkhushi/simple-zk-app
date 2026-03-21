fn main(birth_year: u32, current_year: pub u32, min_age: pub u32) {
    assert(birth_year <= current_year);
    assert(birth_year >= current_year - 150);
    let age = current_year - birth_year;
    assert(age >= min_age);
}

#[test]
fn test_valid_age() {
    main(1990, 2026, 18);
}

#[test]
fn test_exact_threshold() {
    main(2008, 2026, 18);
}
