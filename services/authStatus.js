import "dotenv/config";

const KSEF_ACCESS_URL = process.env.KSEF_ACCESS_URL;

async function getAuthStatus(referenceNumber, authenticationToken) {
  const url = `${KSEF_ACCESS_URL}/auth/${referenceNumber}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      // To jest ważne – status może wymagać autoryzacji:
      Authorization: `Bearer ${authenticationToken}`,
    },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Auth status failed (${res.status}): ${text}`);
  }

  return JSON.parse(text);
}

export default getAuthStatus;