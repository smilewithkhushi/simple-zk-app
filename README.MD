# Simple Circuit: Your First Zero Knowledge Proof Project

This is your first project using **Noir** for generating zero knowledge proofs! 

---

## 📋 Project Overview

This project demonstrates a complete workflow for building, compiling, and verifying zero knowledge circuits using Noir. It serves as both a learning resource and a practical example for beginners.

### Key Technologies
- **Language**: Noir (`.nr` file extension)
- **Proving Backend**: Barretenberg
- **Proving Scheme**: ultra_honk
- **Project Type**: Binary crate
- **Creator**: Aztec Network

---

## 🎯 Your First Simple Circuit

### Basic Circuit Example

```noir
fn main(x: Field, y: pub Field) {
    assert(x != y);
}

#[test]
fn test_circuit() {
    main(1, 2);
}
```

This circuit proves that you know a **private value** (`x`) that is **not equal** to a **public value** (`y`), without revealing `x`.

### How It Works

1. **Private Input `x`**: Only known to the prover
2. **Public Input `y`**: Known to both prover and verifier
3. **Assertion**: `assert(x != y)` creates a constraint
4. **Proof**: Generates a zero knowledge proof that the constraint is satisfied

---

## 📁 Repository Structure

```
simple_circuit/
├── README.MD                      # This file - Project overview
├── Basics.MD                      # Detailed guide to Noir basics & concepts
├── NOIR_GUIDE.md                  # Complete guide to Noir language
├── Nargo.toml                     # Project manifest
├── Prover.toml                    # Input values for testing
├── src/
│   └── main.nr                    # Main circuit entry point
├── 0. Installation/
│   └── README.MD                  # Installation & setup guide for macOS/Windows
└── target/
    ├── simple_circuit.json        # Compiled circuit bytecode
    ├── simple_circuit.gz          # Witness file
    ├── vk                         # Verification key
    ├── proof                      # Generated proof
    └── public_inputs              # Public inputs
```

---

## 🚀 Quick Start

### 1. Install Dependencies

Follow the **[Installation Guide](./0.%20Installation/README.MD)** for:
- macOS or Windows setup
- Rust, Nargo, and Barretenberg installation
- Verification of all tools

### 2. Understand the Basics

Read **[Basics.MD](./Basics.MD)** to learn:
- Variable types in Noir
- Input visibility (private vs public)
- Testing functions
- Complete workflow (check → compile → execute → prove → verify)

### 3. Learn the Language

Check **[NOIR_GUIDE.md](./NOIR_GUIDE.md)** for:
- Language features and syntax
- Common patterns
- Best practices
- Resources and documentation

### 4. Install compatible Barretenberg version

```bash
bbup --noir-version 1.0.0-beta.14
```

### 5. Run Your First Proof

```bash
# 1. Compile circuit
nargo compile

# 2. Generate verification key (one-time)
bb write_vk -b ./target/simple_circuit.json -o ./target

# 3. Execute to generate witness
nargo execute

# 4. Generate proof
bb prove -b ./target/simple_circuit.json -w ./target/simple_circuit.gz -o ./target

# 5. Verify proof
bb verify -k ./target/vk -p ./target/proof
```

### 6. Run the Frontend Demo

```bash
node server.js
# Open http://localhost:3000
```

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| **README.MD** (this file) | Project overview and quick start |
| **Basics.MD** | Detailed Noir basics, types, and workflow |
| **NOIR_GUIDE.md** | Comprehensive Noir language guide |
| **0. Installation/README.MD** | Step-by-step installation for macOS & Windows |

---

## 🔍 Understanding the Workflow

### 1. **Nargo Check** ✓
- Validates circuit structure
- Creates `Prover.toml` for inputs

### 2. **Nargo Compile** 📦
- Compiles Noir to ACIR (Arithmetic Circuit IR)
- Creates circuit bytecode

### 3. **Nargo Execute** ⚙️
- Executes circuit with test inputs
- Generates witness file (`simple_circuit.gz`)
- Stores witness in `/target`

### 4. **BB Write VK** 🔑
- Generates verification key from circuit
- Creates `vk` file for proof verification

### 5. **BB Prove** 🎯
- Uses Barretenberg to create proof
- Combines circuit + witness
- Outputs `proof` and `public_inputs`

### 6. **BB Verify** ✅
- Verifies proof off-chain
- Uses verification key
- Confirms proof validity without executing circuit

---

## 💡 Key Learnings

### About Noir
- **DSL for ZKPs**: Designed specifically for zero knowledge proofs
- **Rust-like Syntax**: Familiar to modern programmers
- **Type-Safe**: Strong type system prevents errors
- **Backend Agnostic**: Can compile to different proving systems

### About Circuits
- **Private vs Public**: Control input visibility
- **Assertions**: Create constraints that must be satisfied
- **Witness**: The satisfying assignment that proves the constraint
- **Proof**: Cryptographic evidence without revealing witness

### About Barretenberg
- **Ultra-Honk Scheme**: Modern proving system
- **High Performance**: Optimized for production use
- **Multi-threaded**: Uses parallel processing for efficiency
- **Aztec-Built**: Developed by Aztec for their privacy network

---

## 🔧 Project Files Explained

### `Nargo.toml` - Project Manifest
```toml
[package]
name = "simple_circuit"
type = "bin"
authors = ["Your Name"]
compiler_version = "0.21.0"
```

- **Type**: `bin` means binary crate (executable)
- **Dependencies**: Add libraries here as needed

### `Prover.toml` - Test Inputs
```toml
lat = "37"
lon = "-122"
north = "38"
west = "-123"
south = "36"
east = "-121"
```

- **Private Inputs**: `lat`, `lon` (user's location, taken from browser)
- **Public Inputs**: `north`, `west`, `south`, `east` (bounding box)
- Updated after each `nargo execute`

### `src/main.nr` - Circuit Code
```noir
fn main(lat: Field, lon: Field, north: pub Field, west: pub Field, south: pub Field, east: pub Field) {
    assert(lat >= south);
    assert(lat <= north);
    assert(lon >= west);
    assert(lon <= east);
}
```

- **Entry Point**: Main circuit logic for bounding box verification
- **Tests**: Validate in-bound and out-of-bound cases
---

## 🌍 Geographical Location Verification Usage

### How to Use

1. **Start the server:**
     ```bash
     node server.js
     # Open http://localhost:3000
     ```
2. **Allow browser geolocation** when prompted. Your coordinates are used privately for the proof.
3. **No need to enter any boundaries!** The bounding box is fixed to cover all of India:
     - North: 37.1
     - West: 68.1
     - South: 6.5
     - East: 97.4
4. **Click 'Generate and Verify Proof'**. The app will:
     - Use your browser location as private input
     - Prove (without revealing your location) that you are inside India
     - Show proof result and steps

#### Test Cases

- **Valid:**
    - User at (17.4, 78.3) (Hyderabad, India) → Proof valid
- **Invalid:**
    - User at (40, -125) (outside India) → Proof fails

---

---

## 📚 Additional Resources

### Official Documentation
- **Noir Book**: https://noir-lang.org/docs/
- **Aztec Network**: https://aztec.network/
- **GitHub Repository**: https://github.com/noir-lang/noir

### Community
- **Discord**: Aztec Network community
- **GitHub Discussions**: Ask questions
- **Forum**: https://forum.aztec.network/

---

## 🎓 Next Steps

### Beginner
- ✅ Understand basic circuit structure
- ✅ Learn input visibility (private vs public)
- ✅ Generate your first proof
- 🔲 Write custom constraints

### Intermediate
- 🔲 Build more complex circuits
- 🔲 Use cryptographic functions (SHA256, ECDSA)
- 🔲 Create reusable code patterns
- 🔲 Optimize circuit size

### Advanced
- 🔲 Build library crates
- 🔲 Integrate with smart contracts
- 🔲 Create proving backends
- 🔲 Contribute to Noir ecosystem

---

## 💫 About This Repository

This is a **learning project** for exploring:
- Zero knowledge proof fundamentals
- Noir programming language
- Barretenberg proving system
- ZK circuit development workflow

Feel free to fork, modify, and learn!

---

## 📝 Notes

- All examples use the **BN254 elliptic curve** (Barretenberg default)
- Proofs are verified using **ultra_honk** scheme
- Generated proofs are **non-interactive** and **publicly verifiable**
- This project uses **test inputs** for demonstration

---


 Powered by zkVerify!