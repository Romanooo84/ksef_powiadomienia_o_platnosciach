import "dotenv/config";

const KSEF_ACCESS_URL = process.env.KSEF_ACCESS_URL;

async function redeemAuthenticationToken(authenticationToken) {
  const res = await fetch(`${KSEF_ACCESS_URL}/auth/token/redeem`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authenticationToken}`,
    },
    body: JSON.stringify({}) // body MUSI być, nawet pusty
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Redeem failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresIn: data.expiresIn,
  };
}
export default redeemAuthenticationToken;