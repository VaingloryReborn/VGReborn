import readline from "node:readline";
import { spawn } from "node:child_process";
import http from "node:http";
import { MitmLogEntry } from "./types";
import {
  getUserByClientIp,
  markUserActive,
  startOfflineMonitor,
} from "./services/userService";
import { handleAction } from "./handlers/actionDispatcher";

const useStdin = process.argv.includes("stdin");

let input: NodeJS.ReadableStream;

if (useStdin) {
  input = process.stdin;
  console.log("mitm-monitor reading from stdin...");
} else {
  const unit = process.env.MITM_UNIT || "mitm-proxy";
  const child = spawn("journalctl", ["-u", unit, "-f", "-o", "cat"]);

  child.stderr.on("data", (chunk) => {
    process.stderr.write(chunk);
  });

  input = child.stdout;
  console.log(`mitm-monitor reading from journalctl -u ${unit} -f -o cat`);
}

async function handleEntry(entry: MitmLogEntry) {
  if (!entry.url) {
    return;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(entry.url);
  } catch {
    return;
  }

  if (parsedUrl.hostname !== "rpc.kindred-live.net") {
    return;
  }

  const clientIp = typeof entry.client_ip === "string" ? entry.client_ip : null;
  console.log("clientId", clientIp);
  if (!clientIp) {
    return;
  }

  const segments = parsedUrl.pathname.split("/").filter(Boolean);
  const action = segments[segments.length - 1];
  console.log("action", action);
  if (!action) {
    return;
  }

  const body = entry.res_body as Record<string, unknown> | null | undefined;
  if (!body || typeof body !== "object") {
    return;
  }

  const result = await getUserByClientIp(clientIp);
  if (!result) {
    return;
  }

  const { userId, user } = result;

  markUserActive(userId, user);

  await handleAction(action, user, body, entry);
}

const rl = readline.createInterface({
  input,
  crlfDelay: Infinity,
});

rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) {
    return;
  }

  if (/^[-=]{5,}$/.test(trimmed)) {
    return;
  }

  try {
    if (!trimmed.includes("{") || !trimmed.includes("}")) {
      return;
    }

    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    const jsonText = trimmed.slice(start, end + 1);

    const data = JSON.parse(jsonText) as MitmLogEntry;
    const output: MitmLogEntry = {
      time: data.time,
      client_ip: data.client_ip,
      method: data.method,
      url: data.url,
      status: data.status,
      req_headers: data.req_headers,
      req_body: data.req_body,
      res_body: data.res_body,
    };

    void handleEntry(output);

    process.stdout.write(`${JSON.stringify(output)}\n`);
  } catch {}
});

rl.on("close", () => {
  console.log("mitm-monitor input closed");
});

// Start the offline monitor
startOfflineMonitor();

// Start HTTP server on port 80
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK");
});

server.on("error", (err) => {
  console.error("Failed to start HTTP server on port 80:", err);
});

server.listen(80, () => {
  console.log("HTTP server listening on port 80");
});
