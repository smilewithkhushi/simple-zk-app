global NUM_CREDENTIALS: u32 = 5;

fn main(credential: Field, valid_credentials: [Field; 5]) {
    credential_in_list(credential, valid_credentials);
}

fn credential_in_list(credential: Field, valid_credentials: [Field; 5]) {
    let mut is_valid = false;
    
    for i in 0..NUM_CREDENTIALS {
        if credential == valid_credentials[i] {
            is_valid = true;
        }
    }
    
    assert(is_valid);
}

#[test]
fn test_valid_credential() {
    let valid = [1, 2, 3, 4, 5];
    credential_in_list(3, valid);
}

#[test]
fn test_invalid_credential() {
    let valid = [1, 2, 3, 4, 5];
    credential_in_list(99, valid);
}
