import getChallenge from './services/challenge.js';
import getPublicKey from './services/getpulbickey.js';
import cryptoToken from './services/crypto.js';
import authKsefToken from './services/authToken.js';
import getAuthStatus from './services/authStatus.js';
import redeemAuthenticationToken from './services/accesToken.js';
import fs from "node:fs/promises";
import "dotenv/config";
let accessTokenData;

const KSEF_URL = process.env.KSEF_URL;
const KSEF_AUTH_URL = process.env.KSEF_AUTH_URL;

const challengeResponse = await getChallenge();
console.log("Otrzymano challenge KSeF");
console.log("challenge:", challengeResponse);

const key = await getPublicKey();
console.log("Pobrano klucz publiczny KSeF.")

const token= cryptoToken(challengeResponse,key);
console.log("Wygenerowano zaszyfrowany token KSeF: ");

const dataToken = await authKsefToken(challengeResponse, token);

const { authToken, referenceNumber } = dataToken;

/*console.log("Uzyskano token autoryzacyjny KSeF: " + authToken);
console.log("ReferenceNumber: " + referenceNumber);*/
console.log("wygotowano token autoryzacyjny KSeF.");
console.log("ref:", referenceNumber);
console.log("authToken looks like JWT:", authToken.split(".").length === 3);

let authStatus;
while (true) {
  authStatus = await getAuthStatus(authToken, referenceNumber);

  const code = authStatus?.status?.code;

  if (code != 100) {
    break; // sukces – wychodzimy z pętli
  }

  // czekamy 100 ms
  await new Promise(resolve => setTimeout(resolve, 1000));
}

console.log("Autoryzacja zakończona:");
const status = authStatus?.status?.code;
if (status === 200) {
  accessTokenData = await redeemAuthenticationToken(authToken)
  console.log("Uzyskano token dostępu KSeF.");


const accessToken = accessTokenData.accessToken;
const refreshToken = accessTokenData.refreshToken;

console.log('pobieram metadane faktur KSeF...');

const path = "/invoices/query/metadata";

async function ksefFetch(path, options = {}) {
console.log("BODY =", options?.body);
  const res = await fetch(`${KSEF_AUTH_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res;
}

const startRes = await ksefFetch("/invoices/query/metadata", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    subjectType: "subject2",   // nabywca
    dateRange: {
      dateType: "issue",
      from: "2026-02-05T00:00:00Z",
      to:   "2026-02-06T10:59:59Z"
    }
  }),
});

/*const startData = await startRes.json();
for (const invoice of startData.invoices) {
console.log(invoice);
}*/

async function downloadInvoiceXml(ksefNumber, accessToken) {
  const url = `${KSEF_AUTH_URL}/invoices/ksef/${encodeURIComponent(ksefNumber)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/xml",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

  const xml = await res.text();
  await fs.writeFile(`invoice-${ksefNumber}.xml`, xml, "utf8");
  return xml;
}

// użycie:
const xml = await downloadInvoiceXml("5260215088-20260205-4D0040E5A28E-BE", accessToken);
}
else {
  console.log("Autoryzacja nie powiodła się.");
}