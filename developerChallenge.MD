# Developer Challenges by zkVerify : Simple Circuit

Pick any challenge, implement the solution, and raise a pull request.

---

### Circuit Challenges (`src/main.nr`)

- **Range Check** — add `0 ≤ y ≤ 100` alongside the equality constraint. *Hint: try Noir's `u8` type instead of `Field`.*
- **Multi-Input Sum** — prove `a + b == sum` where `a`, `b` are private and `sum` is public. *Hint: update `Prover.toml` and the server POST body too.*
- **Fix the Broken Test** — the existing `#[test]` passes `1, 2` which always fails. Fix it and add a `#[test(should_fail)]` case.

### Real-World Circuit Ideas (`src/main.nr` + full stack)

- **Lottery** — prove your private ticket number matches the winning number without revealing it to other participants.
- **Age Verification** — prove `age >= 18` for a voting/KYC flow without disclosing the actual birth date. *Hint: range proof.*
- **Password Login** — prove knowledge of a secret hash without sending the raw password to the server.
- **Balance Sufficiency** — prove a wallet holds enough funds for a transaction without revealing the total balance.
- **NFT Allowlist** — prove a wallet address is on a whitelist without storing all addresses on-chain.
- **Exam Score Gate** — prove a score is above a passing threshold without revealing the exact mark to classmates.

### Backend (`server.js`)

- **Input Validation** — reject missing/non-numeric inputs with descriptive HTTP 400 errors.
- **Rate Limiter** — cap at 5 proof requests per minute per IP.
- **Proof History Log** — keep an in-memory log of the last 10 attempts (timestamp, public input only, outcome, duration); expose via `GET /history`.

### Frontend (`index.html`)

- **Friendly Errors** — map CLI error strings to readable messages (assertion failure, missing tooling, timeout); hide raw output under a collapsible "Details".
- **Theme Toggle** — dark/light switch persisted in `localStorage`, smooth CSS transition.

### DevOps

- **CI Workflow** — GitHub Actions that runs `nargo check` → `nargo test` → `nargo compile` on every push/PR. *Bonus: cache the Nargo install.*

### Docs

- **Document the Circuit** — add a doc comment in `main.nr` explaining what is proved, which inputs are private/public, and what an adversary cannot learn.

---

**Guidelines:** one challenge per PR · run `nargo check` + `nargo test` locally · don't commit `target/` artifacts.
