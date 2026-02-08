import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import xml2js from "xml2js";

console.log("Wczytywanie XML faktury...");
const parser = new xml2js.Parser();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const filePath = path.join(
  projectRoot,
  "download",
  "invoice-5272698282-20260202-3800E0129643-44.xml"
);

console.log(`Wczytywanie pliku XML z: ${filePath}`);

try {
  const data = await fs.readFile(filePath);

  console.log("Plik XML wczytany, rozpoczynam parsowanie...");
  const xmlString = data.toString();

 const dateMatch = xmlString.match(
  /<Termin>[\s\S]*?(.*?)<\/Termin>/
    );

    const NameMatch = xmlString.match(
  /<Nazwa>[\s\S]*?(.*?)<\/Nazwa>/
    );

if (dateMatch) {
  const terminPlatnosci = dateMatch[1];
  console.log("Termin płatności:", terminPlatnosci);
} else {
  console.log("Nie znaleziono terminu płatności");
}

if (NameMatch) {
  const NazwaFirmy = NameMatch[1];
  console.log("Nazwa firmy:", NazwaFirmy);
} else {
  console.log("Nie znaleziono nazwy firmy");
}


} catch (err) {
  console.error("❌ Błąd podczas wczytywania XML:", err);
}

console.log("XML faktury wczytany.");
