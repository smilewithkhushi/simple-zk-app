fn main(total_loans: Field, overdue_loans: Field, max_overdue_allowed: pub Field) {
    assert(overdue_loans <= max_overdue_allowed);
    assert(overdue_loans <= total_loans);
}

#[test]
fn test_main() {
    main(120, 3, 5);
}
