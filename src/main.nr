// Gaming/Tournament Eligibility: Prove player has enough points and level
// without revealing exact stats
fn main(player_points: Field, min_points: pub Field, level: Field, min_level: pub Field) {
    assert(player_points >= min_points);
    assert(level >= min_level);
}

#[test]
fn test_eligible_player() {
    // Player with 1500 points (needs 1000) and level 5 (needs 3) - ELIGIBLE
    main(1500, 1000, 5, 3);
}

#[test]
fn test_insufficient_points() {
    // Player with 800 points (needs 1000) - INELIGIBLE
    // Uncomment to verify failure
    main(800, 1000, 5, 3);
}

#[test]
fn test_insufficient_level() {
    // Player level 2 (needs 3) - INELIGIBLE
    // Uncomment to verify failure
    main(1500, 1000, 2, 3);
}
