fn main(
    d: Field, m: Field, y: Field,          // User DOB
    cd: pub Field, cm: pub Field, cy: pub Field  // Current Date (public)
) {

    // Step 1: Calculate basic age
    let mut age = cy - y;

    // Step 2: Adjust age if birthday not yet reached this year
    // If current month < birth month → age--
    // If same month but current day < birth day → age--
    
    let cond1 = cm < m;
    let cond2 = (cm == m) * (cd < d);

    let should_reduce = cond1 + cond2;

    age = age - should_reduce;

    // Step 3: Verify age >= 18
    assert(age >= 18);
}

#[test]
fn test_main() {
    // Example: DOB = 15/08/2000
    // Current date = 21/03/2026 → Age = 25 → PASS
    main(15, 8, 2000, 21, 3, 2026);

    // Example: DOB = 30/12/2010 → Age < 18 → FAIL
    // Uncomment to test failure
    // main(30, 12, 2010, 21, 3, 2026);
}
