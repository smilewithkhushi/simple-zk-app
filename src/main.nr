// Private Loan Eligibility Verification Circuit
// Proves loan eligibility based on age, income, and credit score without revealing actual values

struct Credentials {
    age: Field,
    income: Field,
    credit_score: Field,
}

fn main(creds: Credentials, min_age: pub Field, min_income: pub Field, min_credit: pub Field) {
    // Bounds checking for realistic values
    assert(creds.age >= 18);
    assert(creds.age <= 100);
    assert(creds.income >= 0);
    assert(creds.income <= 10000000); // Max 10M
    assert(creds.credit_score >= 300);
    assert(creds.credit_score <= 850);
    
    // Eligibility assertions
    assert(creds.age >= min_age);
    assert(creds.income >= min_income);
    assert(creds.credit_score >= min_credit);
}

#[test]
fn test_main() {
    let creds = Credentials { age: 30, income: 75000, credit_score: 720 };
    main(creds, 21, 50000, 650);
    
    // Test failure case (uncomment to see failure)
    // let bad_creds = Credentials { age: 19, income: 30000, credit_score: 600 };
    // main(bad_creds, 21, 50000, 650);
}
