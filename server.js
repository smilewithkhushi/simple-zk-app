const http = require("http");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PORT = 3000;
const ROOT = __dirname;

function updateProverToml(inputs) {
  let content = "";
  for (const [key, value] of Object.entries(inputs)) {
    if (Array.isArray(value)) {
      content += `${key} = [${value.map(v => `"${v}"`).join(", ")}]\n`;
    } else {
      content += `${key} = "${value}"\n`;
    }
  }
  fs.writeFileSync(path.join(ROOT, "Prover.toml"), content);
}

const WHITELIST = ["123", "456", "789", "111", "222", "333", "444", "555"];

// Simple mock for a Merkle Path calculation logic
// In a production app, you would use a real hashing library here
function getMerkleData(secret) {
  const index = WHITELIST.indexOf(secret);
  if (index === -1) return null;

  // Real pre-calculated hashes for secret "123" (Index 0)
  const mocks = [
    [
      "0x2767041dcdd670731fa55e5d3fa9664da044cc1835fac6890333d45c38b2510c",
      "0x05481d9f95037d046f48f430c25a7aee4f6ac0c6dfec8f7004fcfefba5a3637e",
      "0x117a0033ad11d6706e5797d341b126588d927f8045610813f56e9c685bf98275"
    ]
  ];

  return {
    index: index.toString(),
    path: mocks[index] || mocks[0],
    root: "0x1d3680e60971578335b23b10b65d6bd94998781a704618e388fac68d270313f8"
  };
}

function runProof(secret) {
  const merkle = getMerkleData(secret);
  
  if (!merkle) {
    return { success: false, steps: [{ name: "Validating Secret", status: "fail", msg: "This secret code is not on the VIP Whitelist!" }] };
  }

  const inputs = {
    identity_secret: secret,
    merkle_index: merkle.index,
    hash_path: merkle.path,
    root: merkle.root
  };

  updateProverToml(inputs);
  const steps = [{ name: "Validating Secret", status: "ok", msg: "Found on whitelist!" }];

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
      let secret;
      try {
        const parsed = JSON.parse(body);
        secret = parsed.secret || parsed.identity_secret;
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

      const result = runProof(secret);
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
