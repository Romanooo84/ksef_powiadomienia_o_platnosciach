import "dotenv/config";

const KSEF_ACCESS_URL = process.env.KSEF_ACCESS_URL;


async function getAuthStatus(authenticationToken, referenceNumber) {

  console.log("Sprawdzanie statusu autoryzacji KSeF...");
  const url = `${KSEF_ACCESS_URL}/auth/${referenceNumber}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authenticationToken}`,
    },
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Auth status failed (${res.status}): ${text}`);
  return JSON.parse(text);
}


export default getAuthStatus;