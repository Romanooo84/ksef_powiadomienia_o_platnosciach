import "dotenv/config";

const KSEF_ACCESS_URL = process.env.KSEF_ACCESS_URL;

export async function startInvoicesExport(accessToken) {
const exportRequest = {
  encryption: {
    encryptedSymmetricKey: "<base64>",     // obowiązkowe
    initializationVector: "<base64>",      // obowiązkowe
  },
  filters: {
    subjectType: "Subject1",               // typ roli/podmiotu wg KSeF
    dateRange: {
      dateType: "PermanentStorage",        // najczęściej najlepsze do masówki / przyrostu
      from: "2026-02-01T00:00:00Z",
      to:   "2026-02-01T23:59:59Z",
      restrictToPermanentStorageHwmDate: true
    }
  }
};
  const url = `${KSEF_ACCESS_URL}/invoices/exports`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(exportRequest),
  });
   if (!res.ok) {
    throw new Error(`KSeF export start failed: ${res.status} ${await res.text()}`);
  }
  console.log(`Eksport faktur KSeF rozpoczęty: ${res.status} ${res.statusText}`);
  return res.json()
}

export async function getExportStatus(accessToken, referenceNumber) {
  const url = `${KSEF_ACCESS_URL}/invoices/exports/${encodeURIComponent(referenceNumber)}`;
  const res  =await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
    if (!res.ok) {
    throw new Error(`KSeF export start failed: ${res.status} ${await res.text()}`);
  }
  console.log(`Status eksportu KSeF: ${res.status} ${res.statusText}`); 
  return res.json()
}


