fn main(age: Field, score: Field) -> pub Field {
    // Constraints: age >= 18 and score >= 75

    let age_check = age - 18;
    let score_check = score - 75;

    // If both are >= 0, product will be valid
    let is_valid = age_check * score_check;

    is_valid
}