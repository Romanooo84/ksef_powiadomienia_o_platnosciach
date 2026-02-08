import "dotenv/config";
import fs from "node:fs/promises";
import path from "path";

const KSEF_AUTH_URL = process.env.KSEF_AUTH_URL;

async function downloadInvoiceXml(ksefNumber, accessToken) {
  const url = `${KSEF_AUTH_URL}/invoices/ksef/${encodeURIComponent(ksefNumber)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/xml",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status===429) {
    console.log(res.status);
    return res.status;
   
  } else{
    const xml = await res.text();
  const outputDir = path.join(process.cwd(), "download");
  const filePath = path.join(outputDir, `invoice-${ksefNumber}.xml`);
  await fs.writeFile(filePath, xml, "utf8");
  return xml;}

  
  
}

export default downloadInvoiceXml;