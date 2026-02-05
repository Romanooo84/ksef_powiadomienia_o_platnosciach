import "dotenv/config";

const KSEF_AUTH_URL = process.env.KSEF_AUTH_URL;
const KSEF_NIP = process.env.KSEF_NIP;

async function authKsefToken(
  challenge,
  encryptedToken,
) {
  const res = await fetch(`${KSEF_AUTH_URL}/auth/ksef-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
            body: JSON.stringify({
            challenge: challenge.challenge, // dokładnie to, co zwrócił /auth/challenge
            contextIdentifier: {
        type: "nip",
        value: KSEF_NIP,
        },
      encryptedToken,
    }),
  });

  if (!res.ok) {
    throw new Error(`AUTH HTTP ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();

  // w zależności od wersji API pole bywa różnie nazwane
  const authToken =
    data.authenticationToken?.token ||
    data.authenticationToken ||
    data.accessToken ||
    data.token;
  
  const referenceNumber= data.referenceNumber;

  if (!authToken) {
    throw new Error(
      "Nie znaleziono tokena w odpowiedzi auth/ksef-token: " +
      JSON.stringify(data)
    );
  }
  return {authToken, referenceNumber};
}

export default authKsefToken;