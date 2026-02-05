import "dotenv/config";

const KSEF_URL = process.env.KSEF_URL;

async function getPublicKey() {
  const res = await fetch(
    `${KSEF_URL}/security/public-key-certificates`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`KSeF public-key error ${res.status}: ${body}`);
  }

  const data = await res.json();

  const tokenCert = data.find(
    c => Array.isArray(c.usage) && c.usage.includes("KsefTokenEncryption")
  );

  if (!tokenCert || !tokenCert.certificate) {
    const usages = [...new Set(data.flatMap(c => c.usage || []))];
    throw new Error(
      `Brak certyfikatu KsefTokenEncryption. Dostępne usage: ${usages.join(", ")}`
    );
  }

  const certBase64 = tokenCert.certificate;

  const lines = certBase64.match(/.{1,64}/g);

  return (
    "-----BEGIN CERTIFICATE-----\n" +
    lines.join("\n") +
    "\n-----END CERTIFICATE-----"
  );
}

export default getPublicKey;
