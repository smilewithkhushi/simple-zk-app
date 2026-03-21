const http = require("http");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PORT = 3000;
const ROOT = __dirname;

function updateProverToml(birth_year, current_year, min_age) {
  const content = `birth_year = "${birth_year}"\ncurrent_year = "${current_year}"\nmin_age = "${min_age}"\n`;
  fs.writeFileSync(path.join(ROOT, "Prover.toml"), content);
}

function runProof(birth_year, current_year, min_age) {
  updateProverToml(birth_year, current_year, min_age);

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
      "bb prove -b ./target/age_verify.json -w ./target/age_verify.gz -o ./target",
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
      let birth_year, current_year, min_age;
      try {
        ({ birth_year, current_year, min_age } = JSON.parse(body));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

      if (!birth_year || !current_year || !min_age) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "birth_year, current_year, and min_age are required" }));
      }

      const result = runProof(birth_year, current_year, min_age);
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
