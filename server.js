const http = require("http");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PORT = 3000;
const ROOT = __dirname;

function updateProverToml(playerPoints, minPoints, level, minLevel) {
  const content = `player_points = "${playerPoints}"\nmin_points = "${minPoints}"\nlevel = "${level}"\nmin_level = "${minLevel}"\n`;
  fs.writeFileSync(path.join(ROOT, "Prover.toml"), content);
}

function runProof(playerPoints, minPoints, level, minLevel) {
  updateProverToml(playerPoints, minPoints, level, minLevel);

  const steps = [];

  // Try to run the real Noir/Barretenberg flow; if tooling is missing,
  // fall back to a local numeric validation (simulate proof) so the
  // server remains usable without external dependencies.
  let simulated = false;
  try {
    execSync("nargo execute", { cwd: ROOT, stdio: "pipe" });
    steps.push({ name: "nargo execute", status: "ok", msg: "Witness generated" });
  } catch (e) {
    const msg = e.stderr?.toString() || e.message;
    // Detect common "not found" messages and fall back
    if (/not recognized|is not recognized|ENOENT/i.test(msg)) {
      steps.push({ name: "nargo execute", status: "fail", msg: "nargo not available — falling back to local validation" });
      simulated = true;
    } else {
      steps.push({ name: "nargo execute", status: "fail", msg });
      return { success: false, steps };
    }
  }

  if (!simulated) {
    try {
      execSync(
        "bb prove -b ./target/simple_circuit.json -w ./target/simple_circuit.gz -o ./target",
        { cwd: ROOT, stdio: "pipe" }
      );
      steps.push({ name: "bb prove", status: "ok", msg: "Proof generated" });
    } catch (e) {
      steps.push({ name: "bb prove", status: "fail", msg: e.stderr?.toString() || e.message });
      return { success: false, steps };
    }

    try {
      execSync("bb verify -k ./target/vk -p ./target/proof", { cwd: ROOT, stdio: "pipe" });
      steps.push({ name: "bb verify", status: "ok", msg: "Proof verified!" });
    } catch (e) {
      steps.push({ name: "bb verify", status: "fail", msg: e.stderr?.toString() || e.message });
      return { success: false, steps };
    }

    return { success: true, steps };
  }

  // Local numeric validation (simulation): coerce inputs to numbers
  const pPoints = Number(playerPoints);
  const mPoints = Number(minPoints);
  const pLevel = Number(level);
  const mLevel = Number(minLevel);

  if (Number.isNaN(pPoints) || Number.isNaN(mPoints) || Number.isNaN(pLevel) || Number.isNaN(mLevel)) {
    steps.push({ name: "local validation", status: "fail", msg: "Invalid numeric inputs for local validation" });
    return { success: false, steps };
  }

  const eligible = pPoints >= mPoints && pLevel >= mLevel;
  steps.push({ name: "local validation", status: eligible ? "ok" : "fail", msg: eligible ? "Local check passed" : "Local check failed: requirements not met" });

  if (eligible) {
    steps.push({ name: "simulate prove", status: "ok", msg: "Proof generation simulated (tooling missing)" });
    steps.push({ name: "simulate verify", status: "ok", msg: "Proof verified (simulated)" });
    return { success: true, steps };
  }

  return { success: false, steps };
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    const html = fs.readFileSync(path.join(ROOT, "index.html"));
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(html);
  }

  if (req.method === "POST" && req.url === "/prove") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      let playerPoints, minPoints, level, minLevel;
      try {
        ({ playerPoints, minPoints, level, minLevel } = JSON.parse(body));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

      if (!playerPoints || !minPoints || !level || !minLevel) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "playerPoints, minPoints, level, and minLevel are required" }));
      }

      const result = runProof(playerPoints, minPoints, level, minLevel);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`ZK Proof demo running at http://localhost:${PORT}`);
});
