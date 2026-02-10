import fs from "node:fs/promises";
import path from "path";

 async function readFile() {
  const projectRoot = path.resolve(process.cwd());
  const filePath = path.join(projectRoot, 'savedFiles', 'invoicesData.json');

  const buf = await fs.readFile(filePath);
  const json = JSON.parse(buf.toString("utf8"));
  
  return json;
}

export default readFile;