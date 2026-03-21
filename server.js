const http = require("http");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PORT = 3000;
const ROOT = __dirname;
const NUM_CREDENTIALS = 5;

const USE_WSL = true;
const WSL_DISTRO = "Ubuntu";

const VALID_CREDENTIALS = [
    184769969321175  ,
    184769969321176  ,
    184769969321177  ,
    184769969321178  ,
    184769969321179  
];

function execWSL(command, cwd) {
    const wslCmd = `wsl -d ${WSL_DISTRO} bash -c "cd '${cwd.replace(/\\/g, '/').replace(/^([A-Z]):/, m => m.toLowerCase())}' && ${command}"`;
    return execSync(wslCmd, { encoding: 'utf8', stdio: 'pipe' });
}

function updateProverToml(credential, validCredentials) {
    let content = `credential = "${credential}"\n`;
    content += `valid_credentials = [${validCredentials.join(", ")}]\n`;
    fs.writeFileSync(path.join(ROOT, "Prover.toml"), content);
}

function generateVerificationKey() {
function generateVerificationKey() {
    try {
        execWSL("bb write_vk -b ./target/simple_circuit.json -o ./target", ROOT);
        return true;
    } catch (e) {
        return false;
    }
}

function runProof(credential, validCredentials) {
    updateProverToml(credential, validCredentials);

    const steps = [];

    try {
        execWSL("nargo compile", ROOT);
        steps.push({ name: "nargo compile", status: "ok", msg: "Circuit compiled" });
    } catch (e) {
        steps.push({ name: "nargo compile", status: "fail", msg: e.stderr?.toString() || e.message });
        return { success: false, steps };
    }

    try {
        execWSL("nargo execute", ROOT);
        steps.push({ name: "nargo execute", status: "ok", msg: "Witness generated" });
    } catch (e) {
        steps.push({ name: "nargo execute", status: "fail", msg: e.stderr?.toString() || e.message });
        return { success: false, steps };
    }

    generateVerificationKey();

    try {
        execWSL(
            "bb prove -b ./target/simple_circuit.json -w ./target/simple_circuit.gz -o ./target",
            ROOT
        );
        steps.push({ name: "bb prove", status: "ok", msg: "Proof generated" });
    } catch (e) {
        steps.push({ name: "bb prove", status: "fail", msg: e.stderr?.toString() || e.message });
        return { success: false, steps };
    }

    try {
        execWSL("bb verify -k ./target/vk -p ./target/proof", ROOT);
        steps.push({ name: "bb verify", status: "ok", msg: "Proof verified!" });
    } catch (e) {
        steps.push({ name: "bb verify", status: "fail", msg: e.stderr?.toString() || e.message });
        return { success: false, steps };
    }

    return { success: true, steps };
}

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
    }

    if (req.method === "GET" && req.url === "/") {
        const html = fs.readFileSync(path.join(ROOT, "index.html"));
        res.writeHead(200, { "Content-Type": "text/html" });
        return res.end(html);
    }

    if (req.method === "GET" && req.url === "/valid_credentials") {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ 
            valid_credentials: VALID_CREDENTIALS,
            count: VALID_CREDENTIALS.length
        }));
    }

    if (req.method === "POST" && req.url === "/prove") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            let credential, valid_credentials;
            try {
                ({ credential, valid_credentials } = JSON.parse(body));
            } catch {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Invalid JSON" }));
            }

            if (!credential) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "credential is required" }));
            }

            if (!valid_credentials || !Array.isArray(valid_credentials) || valid_credentials.length !== NUM_CREDENTIALS) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ 
                    error: `valid_credentials must be an array of ${NUM_CREDENTIALS} values` 
                }));
            }

            const result = runProof(credential, valid_credentials);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(result));
        });
        return;
    }

    res.writeHead(404);
    res.end("Not found");
});

server.listen(PORT, () => {
    console.log(`Credential Proof demo running at http://localhost:${PORT}`);
});
