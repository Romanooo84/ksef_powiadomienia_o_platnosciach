import "dotenv/config";

const KSEF_AUTH_URL = process.env.KSEF_AUTH_URL;

async function downloadInvoiceMetadata(accessToken,path, options = {}) {
  const res = await fetch(`${KSEF_AUTH_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });

  if (res.status === 401|| res.status === 403) {
    console.log(res.status);
    return res.status;
  }

    if (!res.ok) {
      return null;
    }

  return res.json();
}

export default downloadInvoiceMetadata;

