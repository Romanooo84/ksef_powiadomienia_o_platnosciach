import "dotenv/config";

const KSEF_AUTH_URL = process.env.KSEF_AUTH_URL;
const pageSize = 100;
let offset = 0;

async function downloadInvoiceMetadata(accessToken,path, options = {}) {
  const res = await fetch(`${KSEF_AUTH_URL}${path}?pageSize=${pageSize}&pageOffset=${offset}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });

 

  if (res.status === 401|| res.status === 403 || res.status === 429) {
     console.log(`Odpowiedź serwera KSeF: ${res.status} ${res.statusText}`);
    return res.status;
  }

    if (!res.ok) {
      return null;
    }

  return res.json();
}

export default downloadInvoiceMetadata;

