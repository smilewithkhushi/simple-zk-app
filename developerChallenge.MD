# Developer Challenges: Simple Circuit Boilerplate

Welcome to the Simple Circuit challenge board! This document outlines a set of hands-on problem statements for developers looking to extend and improve this Zero-Knowledge Proof boilerplate. Each challenge is self-contained and designed to deepen your understanding of Noir circuits, ZK proof workflows, and full-stack integration.

Pick any challenge, implement the solution, and raise a pull request.

---

## Challenge 1 — Fix the Broken Test

**File:** `src/main.nr`

The existing test function intentionally passes inputs that violate the circuit constraint:

```noir
#[test]
fn test_main() {
    main(1, 2); // 1 ≠ 2, this will always fail
}
```

**Problem Statement:**
- Fix the test so it properly validates a passing case (`x == y`).
- Add a second test that uses `#[test(should_fail)]` to assert that invalid inputs (where `x ≠ y`) correctly trigger a circuit failure.
- Run `nargo test` to confirm both tests pass.

**Expected Outcome:** `nargo test` reports all tests passing.

---

## Challenge 2 — Extend the Circuit with a Range Check

**File:** `src/main.nr`

The circuit currently only checks equality. Real-world ZK applications often require range proofs.

**Problem Statement:**
- Modify the circuit so that it proves:
  1. `x == y` (equality constraint, existing)
  2. `y` is within a valid range, e.g., `0 ≤ y ≤ 100`
- Use Noir's built-in `assert` and type constraints to enforce this.
- Update `Prover.toml` with valid test inputs.
- Update the frontend input validation in `index.html` to match the new accepted range.

**Hint:** Explore Noir's integer types (`u8`, `u32`) and how casting from `Field` works.

---

## Challenge 3 — Add a Multi-Input Circuit

**File:** `src/main.nr`, `server.js`, `index.html`

The circuit currently takes only two inputs. Expand it to support a more meaningful computation.

**Problem Statement:**
- Rewrite the circuit to prove knowledge of two private values `a` and `b` such that:
  - `a + b == sum` (where `sum` is the public output)
- Make `a` and `b` private inputs and `sum` a public input.
- Update `Prover.toml` with example values.
- Update `server.js` to accept `a`, `b`, and `sum` in the POST body.
- Update the frontend form in `index.html` to include input fields for all three values.

---

## Challenge 4 — Add Input Validation on the Server

**File:** `server.js`

The server currently accepts any values for `x` and `y` without validation and passes them directly into the circuit. Malformed inputs can cause cryptic errors.

**Problem Statement:**
- Add request validation in the `POST /prove` endpoint:
  - Reject requests where `x` or `y` are missing, empty, or non-numeric.
  - Return descriptive HTTP 400 errors with a JSON body explaining what is invalid.
- Add a simple rate limiter to prevent abuse (e.g., max 5 requests per minute per IP).
- Write a comment block explaining why each validation rule exists.

---

## Challenge 5 — Structured Error Responses in the UI

**File:** `index.html`

When proof generation fails, the UI currently displays raw error output from the CLI, which is hard to read for beginners.

**Problem Statement:**
- Parse the error response from the server in the frontend JavaScript.
- Map known error types to human-readable messages, for example:
  - Assertion failure → "Your private input does not satisfy the circuit constraint."
  - Missing binary → "Required tooling (nargo/bb) is not installed."
  - Timeout → "Proof generation timed out. Try again."
- Display these friendly messages in the result panel instead of raw CLI output.
- For unknown errors, still display the raw output but under a collapsible "Details" section.

---

## Challenge 6 — Add a Proof History Log

**Files:** `server.js`, `index.html`

Currently, every proof generation is stateless. There is no record of past attempts.

**Problem Statement:**
- On the server, maintain an in-memory log of the last 10 proof attempts, storing:
  - Timestamp
  - Input values (only public inputs — never log private values)
  - Outcome (success or failure)
  - Duration in milliseconds
- Expose this log via a `GET /history` endpoint that returns JSON.
- In the frontend, add a collapsible "Recent Proofs" panel that fetches and renders this history on page load.

**Note:** Only public inputs (`y`) should appear in the log. Never log private inputs (`x`).

---

## Challenge 7 — Add a CI Workflow

**File:** `.github/workflows/ci.yml` (new file)

The project has no automated testing or continuous integration.

**Problem Statement:**
- Create a GitHub Actions workflow that runs on every push and pull request.
- The workflow should:
  1. Install Nargo using the official Noir installer.
  2. Run `nargo check` to validate the circuit.
  3. Run `nargo test` to execute the test suite.
  4. Run `nargo compile` and verify the output artifact exists.
- The workflow should fail if any step exits with a non-zero code.

**Bonus:** Cache the Nargo installation to speed up runs.

---

## Challenge 8 — Replace File-Based I/O with Programmatic Proof Generation

**File:** `server.js`

The server currently writes to `Prover.toml` on disk and shells out to CLI tools. This is fragile and not suitable for concurrent requests.

**Problem Statement:**
- Investigate the `@noir-lang/noir_js` and `@aztec/bb.js` npm packages.
- Refactor `server.js` to generate proofs programmatically in-process instead of:
  - Writing to `Prover.toml`
  - Shelling out to `nargo execute`, `bb prove`, `bb verify`
- This eliminates file-system race conditions when multiple users submit proofs simultaneously.

**Expected Outcome:** Proof generation works correctly without writing any files to disk.

---

## Challenge 9 — Dark/Light Theme Toggle

**File:** `index.html`

The UI is currently hardcoded to a dark theme.

**Problem Statement:**
- Add a theme toggle button (top-right corner) that switches between dark and light modes.
- Persist the user's preference in `localStorage` so it is remembered on refresh.
- Ensure the light theme maintains sufficient contrast ratios (WCAG AA minimum).
- The toggle should animate smoothly (CSS transition on background and text colors).

---

## Challenge 10 — Document the Circuit Constraint Formally

**Files:** `src/main.nr`, `README.MD`

The circuit has no inline documentation, and the README does not explain the cryptographic guarantee being made.

**Problem Statement:**
- Add a doc comment above the `main` function in `src/main.nr` that explains:
  - What the circuit proves
  - Which inputs are private vs. public and why
  - What an adversary cannot learn from the proof
- Add a "What does this prove?" section to `README.MD` that explains the zero-knowledge property of this specific circuit in plain language (no jargon assumed).

---

## Contribution Guidelines

1. **One challenge per pull request.** Do not bundle multiple challenges into a single PR.
2. Include a brief description in your PR of what you changed and why.
3. Run `nargo check` and `nargo test` locally before opening a PR.
4. Do not commit binary artifacts in `target/` (proofs, witness files, etc.).
5. Keep changes focused — do not refactor unrelated code while solving a challenge.

---

*Challenges created for the Simple Circuit ZK boilerplate — built with Noir and Barretenberg.*
