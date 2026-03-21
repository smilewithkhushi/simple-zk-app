const http = require("http");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PORT = 3000;
const ROOT = __dirname;

function updateProverToml(age, income, credit_score, min_age, min_income, min_credit) {
  const content = `creds.age = "${age}"\ncreds.income = "${income}"\ncreds.credit_score = "${credit_score}"\nmin_age = "${min_age}"\nmin_income = "${min_income}"\nmin_credit = "${min_credit}"\n`;
  fs.writeFileSync(path.join(ROOT, "Prover.toml"), content);
}

function runProof(age, income, credit_score, min_age, min_income, min_credit) {
  updateProverToml(age, income, credit_score, min_age, min_income, min_credit);

  const steps = [];

  try {
    execSync("nargo compile", { cwd: ROOT, stdio: "pipe" });
    steps.push({ name: "nargo compile", status: "ok", msg: "Circuit compiled" });
  } catch (e) {
    steps.push({ name: "nargo compile", status: "fail", msg: e.stderr?.toString() || e.message });
    return { success: false, steps };
  }

  try {
    execSync("nargo execute", { cwd: ROOT, stdio: "pipe" });
    steps.push({ name: "nargo execute", status: "ok", msg: "Witness generated" });
  } catch (e) {
    steps.push({ name: "nargo execute", status: "fail", msg: e.stderr?.toString() || e.message });
    return { success: false, steps };
  }

  try {
    execSync(
      "bb prove -b ./target/loan_eligibility_circuit.json -w ./target/loan_eligibility_circuit.gz -o ./target",
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
      let { age, income, credit_score, min_age, min_income, min_credit } = JSON.parse(body);
      try {
        ({ age, income, credit_score, min_age, min_income, min_credit } = JSON.parse(body));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

      if (!age || !income || !credit_score || !min_age || !min_income || !min_credit) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "All fields are required" }));
      }

      const result = runProof(age, income, credit_score, min_age, min_income, min_credit);
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
