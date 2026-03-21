const http = require("http");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PORT = 3000;
const ROOT = __dirname;

function updateProverToml(age, vote) {
  const content = `age = "${age}"\nvote = "${vote}"\n`;
  fs.writeFileSync(path.join(ROOT, "Prover.toml"), content);
}

function runProof(age, vote) {
  updateProverToml(age, vote);

  const steps = [];

  try {
    execSync("nargo execute", { cwd: ROOT, stdio: "pipe" });
    steps.push({ name: "nargo execute", status: "ok", msg: "Witness generated" });
  } catch (e) {
    steps.push({ name: "nargo execute", status: "fail", msg: e.stderr?.toString() || e.message });
    return { success: false, steps };
  }

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
      let age, vote;
      try {
        ({ age, vote } = JSON.parse(body));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

      if (!age || !vote) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "age and vote are required" }));
      }

      const result = runProof(age, vote);
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
