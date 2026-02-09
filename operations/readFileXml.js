import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";

 async function readFileXml() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const projectRoot = path.resolve(__dirname, "..");

  const dirPath = path.join(projectRoot, "download");
  const files = await fs.readdir(dirPath, { withFileTypes: true });

  const invoicesData = {};

  for (const file of files) {
    if (!file.isFile()) continue;

    const filePath = path.join(dirPath, file.name);

    const buf = await fs.readFile(filePath);
    const xmlString = buf.toString("utf8");

    const dateMatch = xmlString.match(/<Termin>\s*([\s\S]*?)\s*<\/Termin>/);
    const nameMatch = xmlString.match(/<Nazwa>\s*([\s\S]*?)\s*<\/Nazwa>/);
    const valueMatch = xmlString.match(/<P_15>\s*([\s\S]*?)\s*<\/P_15>/);
    const invoiceNoMatch = xmlString.match(/<P_2>\s*([\s\S]*?)\s*<\/P_2>/);

    const numer = invoiceNoMatch ? invoiceNoMatch[1].trim() : file.name;

    invoicesData[numer] = {
      terminPlatnosci: dateMatch ? dateMatch[1].trim() : null,
      NazwaFirmy: nameMatch ? nameMatch[1].trim() : null,
      kwota: valueMatch ? valueMatch[1].trim() : null,
    };
  }

  const saveDir = path.join(projectRoot, "savedFiles");
  await fs.mkdir(saveDir, { recursive: true }); // ✅
  const savePath = path.join(saveDir, "invoicesData.json");

  await fs.writeFile(savePath, JSON.stringify(invoicesData, null, 2), "utf8");
  console.log("✅ Zapisano:", savePath);

  return invoicesData;
}

export default readFileXml;