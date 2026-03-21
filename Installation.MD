# Installation & Setup Guide for Noir & Barretenberg

A complete step-by-step guide to install Noir, Barretenberg, and all dependencies on macOS and Windows for beginners.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [macOS Installation](#macos-installation)
3. [Windows Installation](#windows-installation)
4. [Generating Boilerplate Code](#generating-boilerplate-code)
5. [Barretenberg Setup](#barretenberg-setup)
6. [Verification of Installation](#verification-of-installation)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- **Administrator/Sudo Access**: Required for system-level installations
- **Internet Connection**: For downloading packages and dependencies
- **Disk Space**: At least 2GB free space
- **Terminal/Command Line**: Basic command-line knowledge

---

## macOS Installation

### System Requirements

- **macOS Version**: 10.13 or later
- **Processor**: Intel or Apple Silicon (M1/M2/M3)
- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: 2GB minimum

### Step 1: Install Homebrew (Package Manager)

**What is Homebrew?**
Homebrew is a package manager for macOS that simplifies software installation.

**Installation**:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Verify Installation**:

```bash
brew --version
```

Expected output:
```
Homebrew 4.x.x
```

---

### Step 2: Install Rust

**What is Rust?**
Rust is a systems programming language required to build and compile Noir.

**Installation using Rustup**:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**During installation**, select option `1` (Proceed with installation).

**Configure Current Shell**:

```bash
source $HOME/.cargo/env
```

**Verify Installation**:

```bash
rustc --version
cargo --version
```

Expected output:
```
rustc 1.73.0 (or later)
cargo 1.73.0 (or later)
```

---

### Step 3: Install Noir (Nargo)

**What is Nargo?**
Nargo is the command-line tool for Noir that handles compilation, execution, and circuit management.

**Installation using Noirup**:

```bash
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
```

**Reload Shell Configuration**:

```bash
source ~/.zshrc
```

Or if using bash:

```bash
source ~/.bash_profile
```

**Verify Installation**:

```bash
nargo --version
```

Expected output:
```
nargo version = X.X.X
```

---

### Step 4: Install Node.js (Optional but Recommended)

**What is Node.js?**
Node.js is needed for JavaScript integration and some development tools.

**Installation using Homebrew**:

```bash
brew install node
```

**Verify Installation**:

```bash
node --version
npm --version
```

Expected output:
```
v18.x.x (or later)
8.x.x (or later)
```

---

### Step 5: Install Barretenberg

**What is Barretenberg?**
Barretenberg is the cryptographic backend that generates and verifies zero knowledge proofs from Noir circuits.

**Installation using Homebrew**:

```bash
brew tap barretenberg/barretenberg https://github.com/AztecProtocol/barretenberg.git
brew install barretenberg
```

**For Apple Silicon (M1/M2/M3) Macs**:

If the Homebrew installation fails, use prebuilt binaries:

```bash
# Download prebuilt binary
curl -L https://github.com/AztecProtocol/barretenberg/releases/download/v0.21.0/barretenberg-x86_64-apple-darwin.tar.gz -o barretenberg.tar.gz

# Extract
tar -xzf barretenberg.tar.gz

# Move to PATH
sudo mv barretenberg/bin/bb /usr/local/bin/

# Verify
bb --version
```

**Verify Installation**:

```bash
bb --version
```

Expected output:
```
Barretenberg version 0.21.0 (or later)
```

---

### Step 6: Verify Complete Installation

Run the following command to verify all components:

```bash
echo "=== macOS Installation Verification ===" && \
echo "Rust: $(rustc --version)" && \
echo "Cargo: $(cargo --version)" && \
echo "Nargo: $(nargo --version)" && \
echo "Node.js: $(node --version)" && \
echo "npm: $(npm --version)" && \
echo "Barretenberg: $(bb --version)"
```

All commands should return version information without errors.

---

## Windows Installation

### System Requirements

- **Windows Version**: Windows 10 or Windows 11
- **Processor**: Any modern processor
- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: 2GB minimum

### Step 1: Install Visual Studio Build Tools

**What are Build Tools?**
Visual Studio Build Tools provide necessary C++ compilation tools for Rust and other dependencies.

**Download & Install**:

1. Visit: https://visualstudio.microsoft.com/downloads/
2. Click "All Downloads" → "Visual Studio Build Tools"
3. Download and run installer
4. Select "Desktop development with C++"
5. Click "Install"

**Verification**:

Open Command Prompt and verify installation completed successfully.

---

### Step 2: Install Rust

**Installation using Rustup**:

1. Visit: https://www.rust-lang.org/tools/install
2. Click "Download RUSTUP-INIT.EXE"
3. Run the downloaded file
4. When prompted, press `1` and then Enter to proceed with installation

**Open New Command Prompt** (to reload environment variables):

```cmd
rustc --version
cargo --version
```

Expected output:
```
rustc 1.73.0 (or later)
cargo 1.73.0 (or later)
```

---

### Step 3: Install Noir (Nargo)

**Installation using Noirup**:

Open PowerShell (Windows PowerShell, not Command Prompt) and run:

```powershell
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
```

If you don't have `curl`, first install it or download using a browser.

**Alternative Method** (if curl fails):

Download from: https://github.com/noir-lang/noir/releases

Extract and add to PATH manually.

**Open New PowerShell** (to reload environment variables):

```powershell
nargo --version
```

Expected output:
```
nargo version = X.X.X
```

---

### Step 4: Install Node.js (Optional but Recommended)

**Installation using Installer**:

1. Visit: https://nodejs.org/
2. Download LTS version (e.g., 18.x or 20.x)
3. Run installer and follow default options
4. Restart Command Prompt after installation

**Verify Installation**:

```cmd
node --version
npm --version
```

Expected output:
```
v18.x.x (or later)
8.x.x (or later)
```

---

### Step 5: Install Barretenberg

**Installation Method 1: Using Git (Recommended)**

1. Install Git for Windows: https://git-scm.com/download/win
2. Clone Barretenberg repository:

```powershell
git clone https://github.com/AztecProtocol/barretenberg.git
cd barretenberg
```

3. Build using CMake:

```powershell
mkdir build
cd build
cmake ..
cmake --build . --config Release
```

**Installation Method 2: Using Pre-built Binaries**

1. Visit: https://github.com/AztecProtocol/barretenberg/releases
2. Download latest `bb-windows.exe`
3. Save to a folder, e.g., `C:\barretenberg\`
4. Add to system PATH:
   - Right-click "This PC" → Properties
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", click "Path" → "Edit"
   - Click "New" and add `C:\barretenberg\`
   - Click OK and restart Command Prompt

**Verify Installation**:

```cmd
bb --version
```

Expected output:
```
Barretenberg version 0.21.0 (or later)
```

---

### Step 6: Verify Complete Installation

Open Command Prompt and run:

```cmd
echo === Windows Installation Verification === && ^
rustc --version && ^
cargo --version && ^
nargo --version && ^
node --version && ^
npm --version && ^
bb --version
```

All commands should return version information without errors.

---

## Generating Boilerplate Code

### Create New Noir Project

**Command** (both macOS and Windows):

```bash
nargo new my_first_circuit
cd my_first_circuit
```

**Generated Structure**:

```
my_first_circuit/
├── Nargo.toml          # Project manifest
├── Prover.toml         # Input values template
└── src/
    └── main.nr         # Main circuit file
```

---

### Project Manifest (Nargo.toml)

```toml
[package]
name = "my_first_circuit"
type = "bin"
authors = ["Your Name"]
compiler_version = "0.21.0"

[dependencies]
# Add dependencies here as needed
# Example: std = { git = "https://github.com/noir-lang/std", tag = "v0.21.0" }
```

### Main Circuit File (src/main.nr)

**Gaming/Tournament Eligibility Example**:

```noir
// Prove you meet tournament requirements without revealing exact stats
fn main(player_points: Field, min_points: pub Field, level: Field, min_level: pub Field) {
    assert(player_points >= min_points);
    assert(level >= min_level);
}

#[test]
fn test_eligible() {
    main(1500, 1000, 5, 3); // Eligible: has 1500 pts (needs 1000) and level 5 (needs 3)
}
```

### Prover Template (Prover.toml)

```toml
player_points = "1500"
min_points = "1000"
level = "5"
min_level = "3"
```

---

## Barretenberg Setup

### Understanding Barretenberg

**Barretenberg** is a high-performance proving system that:
- Compiles Noir circuits into proofs
- Generates verification keys
- Creates zero knowledge proofs
- Verifies proofs cryptographically

### Barretenberg Components

```
Barretenberg
├── ACIR Compiler: Converts Noir to arithmetic circuits
├── Prover: Generates proofs from circuits + witnesses
├── Verifier: Validates proofs
└── Backend: Ultra-Honk proving scheme (default)
```

### Working with Barretenberg

#### Command 1: Write Verification Key

```bash
bb write_vk -b ./target/simple_circuit.json -o ./target
```

**Parameters**:
- `-b`: Path to compiled circuit bytecode
- `-o`: Output directory for verification key

**Output**:
- `vk` file: Verification key for proof validation

---

#### Command 2: Generate Proof

```bash
bb prove -b ./target/simple_circuit.json -w ./target/simple_circuit.gz -o ./target
```

**Parameters**:
- `-b`: Path to compiled circuit bytecode
- `-w`: Path to witness file
- `-o`: Output directory for proof

**Output**:
- `proof`: Generated zero knowledge proof
- `public_inputs`: Public inputs used in proof

---

#### Command 3: Verify Proof

```bash
bb verify -k ./target/vk -p ./target/proof
```

**Parameters**:
- `-k`: Path to verification key
- `-p`: Path to proof

**Output**:
- Success/Failure message

---

### Complete Barretenberg Workflow

**Step 1: Compile with Nargo**

```bash
nargo compile
```

**Step 2: Execute to Generate Witness**

```bash
nargo execute
```

**Step 3: Generate Verification Key**

```bash
bb write_vk -b ./target/simple_circuit.json -o ./target
```

**Step 4: Create Proof**

```bash
bb prove -b ./target/simple_circuit.json -w ./target/simple_circuit.gz -o ./target
```

**Step 5: Verify Proof**

```bash
bb verify -k ./target/vk -p ./target/proof
```

---

## Verification of Installation

### macOS Verification Script

Create a file called `verify_installation.sh`:

```bash
#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        Noir & Barretenberg Installation Verification      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "✓ Checking Rust..."
rustc --version || echo "✗ Rust not found"
cargo --version || echo "✗ Cargo not found"
echo ""

echo "✓ Checking Noir..."
nargo --version || echo "✗ Nargo not found"
echo ""

echo "✓ Checking Node.js..."
node --version || echo "✗ Node.js not found"
npm --version || echo "✗ npm not found"
echo ""

echo "✓ Checking Barretenberg..."
bb --version || echo "✗ Barretenberg not found"
echo ""

echo "✓ Checking environment variables..."
echo "PATH: $PATH"
echo ""

echo "✓ Testing Nargo new project..."
if command -v nargo &> /dev/null; then
    nargo new test_circuit 2>/dev/null
    if [ -f "test_circuit/src/main.nr" ]; then
        echo "✓ Nargo project creation successful"
        rm -rf test_circuit
    else
        echo "✗ Nargo project creation failed"
    fi
fi
```

Run it:

```bash
chmod +x verify_installation.sh
./verify_installation.sh
```

---

### Windows Verification Script

Create a file called `verify_installation.bat`:

```batch
@echo off
setlocal enabledelayedexpansion

echo ════════════════════════════════════════════════════════════
echo        Noir ^& Barretenberg Installation Verification
echo ════════════════════════════════════════════════════════════
echo.

echo ✓ Checking Rust...
rustc --version || echo ✗ Rust not found
cargo --version || echo ✗ Cargo not found
echo.

echo ✓ Checking Noir...
nargo --version || echo ✗ Nargo not found
echo.

echo ✓ Checking Node.js...
node --version || echo ✗ Node.js not found
npm --version || echo ✗ npm not found
echo.

echo ✓ Checking Barretenberg...
bb --version || echo ✗ Barretenberg not found
echo.

echo ✓ Verification complete!
pause
```

Run it by double-clicking or:

```cmd
verify_installation.bat
```

---

## Troubleshooting

### Common Issues & Solutions

#### Issue 1: "nargo command not found"

**macOS**:
```bash
# Reload shell configuration
source ~/.zshrc
# or
source ~/.bash_profile

# Manually add to PATH
export PATH="$PATH:$HOME/.nargo/bin"
```

**Windows**:
- Restart Command Prompt or PowerShell
- Check if C:\Users\YourUsername\.nargo\bin is in System PATH
- If not, manually add it

---

#### Issue 2: "bb command not found"

**macOS**:
```bash
# Check if Barretenberg is installed
which bb

# If not found, try manual installation
cd /tmp
curl -L https://github.com/AztecProtocol/barretenberg/releases/download/v0.21.0/barretenberg-x86_64-apple-darwin.tar.gz -o bb.tar.gz
tar -xzf bb.tar.gz
sudo mv barretenberg/bin/bb /usr/local/bin/
```

**Windows**:
- Verify bb.exe is in your PATH
- Restart Command Prompt after PATH changes
- Check firewall isn't blocking execution

---

#### Issue 3: "rustc: command not found"

**macOS & Windows**:
```bash
# Reinstall Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Reload environment
source $HOME/.cargo/env  # macOS
# or restart Command Prompt (Windows)
```

---

#### Issue 4: Slow installation or downloads fail

**Solutions**:
- Check internet connection stability
- Try downloading again if connection interrupted
- Use a different network if available
- For macOS, try Homebrew mirror: `brew config` to check mirrors

---

#### Issue 5: Permission denied errors (macOS)

**Solution**:
```bash
# Use sudo for system-wide installations
sudo chown -R $(whoami) ~/.nargo
sudo chown -R $(whoami) ~/.cargo
```

---

#### Issue 6: Out of disk space

**Solution**:
- Free up at least 2GB of disk space
- Remove cache: `cargo clean`
- Remove build artifacts in project: `rm -rf target/`

---

## Platform-Specific Tips

### macOS Tips

1. **Update Homebrew**:
   ```bash
   brew update
   brew upgrade
   ```

2. **Check Brew Doctor**:
   ```bash
   brew doctor
   ```

3. **For M1/M2/M3 Macs**: Some tools work better with Rosetta 2
   ```bash
   # Install Rosetta 2
   softwareupdate --install-rosetta
   ```

---

### Windows Tips

1. **Use PowerShell as Administrator**: Right-click → "Run as administrator"

2. **Check Environment Variables**:
   - Press `Win + X` → "System"
   - Click "Advanced system settings"
   - Check "Environment Variables"

3. **Restart After Installing**: Windows requires restart for PATH updates

4. **Antivirus Settings**: Some antivirus software may interfere with compilation

---

## Next Steps

After successful installation:

1. ✅ Verify all components are installed
2. 📁 Create your first Noir project: `nargo new hello_noir`
3. 📝 Write a simple circuit in `src/main.nr`
4. 🔧 Compile the circuit: `nargo compile`
5. ✅ Run tests: `nargo test`
6. 🚀 Generate proofs: `nargo execute`

---

## Getting Help

If you encounter issues:

1. **Check Official Documentation**: https://noir-lang.org/docs/
2. **Aztec Discord**: Join the community
3. **GitHub Issues**: Report bugs at https://github.com/noir-lang/noir/issues
4. **Stack Exchange**: Ask questions with `#noir` tag

---

*This guide is regularly updated. Last updated: October 2025*
