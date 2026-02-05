import getChallenge from './services/challenge.js';
import getPublicKey from './services/getpulbickey.js';
import cryptoToken from './services/crypto.js';
import authKsefToken from './services/authToken.js';
import getAuthStatus from './services/authStatus.js';
import redeemAuthenticationToken from './services/accesToken.js';
import "dotenv/config";

const KSEF_URL = process.env.KSEF_URL;
const KSEF_AUTH_URL = process.env.KSEF_AUTH_URL;

const challengeResponse = await getChallenge();
console.log("Otrzymano challenge KSeF:")

const key = await getPublicKey();
console.log("Pobrano klucz publiczny KSeF." + key)

const token= cryptoToken(challengeResponse,key);
console.log("Wygenerowano zaszyfrowany token KSeF: "+token);

const dataToken = await authKsefToken(challengeResponse, token);

const { authToken, referenceNumber } = dataToken;

console.log("Uzyskano token autoryzacyjny KSeF: " + authToken);
console.log("ReferenceNumber: " + referenceNumber);

const authStatus = await getAuthStatus(referenceNumber, authToken);
console.log("Status autoryzacji KSeF: " + JSON.stringify(authStatus));

/*
const accessToken = await redeemAuthenticationToken(authToken);
console.log("Uzyskano token dostępu KSeF." + accessToken.accessToken);

const path = "/invoices/query/metadata";

async function ksefFetch(path, options = {}) {
  const res = await fetch(`${KSEF_AUTH_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res;
}

const startRes = await ksefFetch(path, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
     issueDate: {
    from: "2026-02-01",
    to: "2026-02-04"
  }
  }),
});

const startData = await startRes.json();
// zwykle dostajesz jakiś "queryReferenceNumber"/"referenceNumber" do sprawdzania statusu
startData */