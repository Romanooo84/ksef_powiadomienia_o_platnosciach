import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// np. katalog logs w projekcie
const logDir = path.join(__dirname, ".."); // <- jeśli saveAndLog.js jest w operations/
const logFile = path.join(logDir, "logs.txt");

export default function log(message) {
  try {
    const timestamp = new Date().toISOString();
    const fullMessage = `[${timestamp}] ${message}`;
    fs.appendFileSync(logFile, fullMessage + "\n", "utf8");
    console.log(fullMessage);
  } catch (e) {
    console.error("LOG WRITE ERROR:", e?.message || e);
  }
}