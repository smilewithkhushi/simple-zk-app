//all files to be included here only

// Geographical Location Verification Circuit
// User's lat/lon are private, bounding box is public
fn main(
    lat: Field, // User latitude (private)
    lon: Field, // User longitude (private)
    north: pub Field, // Bounding box north (public)
    west: pub Field,  // Bounding box west (public)
    south: pub Field, // Bounding box south (public)
    east: pub Field   // Bounding box east (public)
) {
    // Latitude must be between south and north
    assert(lat >= south);
    assert(lat <= north);
    // Longitude must be between west and east
    assert(lon >= west);
    assert(lon <= east);
}


#[test]
fn test_valid_location() {
    // User at (37, -122), bounding box (north: 38, west: -123, south: 36, east: -121)
    main(37, -122, 38, -123, 36, -121);
}

#[test]
fn test_invalid_location() {
    // User at (40, -125), outside bounding box
    // Should fail
    main(40, -125, 38, -123, 36, -121);
}
