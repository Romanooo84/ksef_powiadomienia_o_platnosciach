import crypto from "node:crypto";
import "dotenv/config";

const cryptoToken = (challenge, ksefCertPem) => {
  const raw = process.env.KSEF_TOKEN;

  if (!challenge?.timestampMs) throw new Error("Brak challenge.timestampMs");
  if (!challenge?.challenge) throw new Error("Brak challenge.challenge");

  if (!raw) throw new Error("Brak KSEF_TOKEN w .env");
  if (!challenge?.timestamp) throw new Error("Brak challenge.timestamp");

  const token = raw.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  if (/[^\x21-\x7E]/.test(token)) {
    throw new Error("KSEF_TOKEN ma niewidoczne/niepoprawne znaki (np. CRLF/BOM/spacje). Wklej token ponownie.");
  }

  const ts = String(challenge.timestampMs); // <- TO
  const payload = Buffer.from(`${token}|${ts}`, "utf8");

  const publicKey = crypto.createPublicKey(ksefCertPem);

  const ciphertext = crypto.publicEncrypt(
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
    payload
  );

  return ciphertext.toString("base64");
};

export default cryptoToken;
