import invoiceOperations from "./mainThreads/InvoiceOperations.js";
import addEventToCallendar from "./operations/addEventToCallendar.js";
import cron from 'node-cron'
import getGoogleAuthClient from "./services/googleAuth/serverGoogleAuth.js";
import log from "./operations/saveAndLog.js";
import http from "node:http";
import fs from "node:fs";

const port = process.env.PORT || 3000;

http.createServer((req, res) => {

  if (req.url === "/test") {

    // zapis do pliku w katalogu aplikacji
    fs.appendFileSync("test.txt", "Wywołanie: " + new Date().toISOString() + "\n");

    res.end("dziaLa.....");
    log('działa')
    return;
  }

  res.statusCode = 404;
  res.end("404");

}).listen(port, () => {
  console.log("Serwer działa na porcie", port);
  log("Serwer działa na porcie", port)
});


log('logowanie do Google')
const auth = getGoogleAuthClient();
log('startuję aplikację')

const main = async () => {

  log("Uruchamiam aplikację...");
  
  
  const delayKsefTime = '10 11 * * *'
  const delayCallendarTime = '20 11 * * *'
  
  log(`Ustawiam zadanie pobierania danych z KSeF na ${delayKsefTime}...`);
  log(`Ustawiam zadanie dodawania wydarzeń do kalendarza na ${delayCallendarTime}...`);
  
  await invoiceOperations(delayKsefTime);
  
  cron.schedule(delayCallendarTime, async () => {await addEventToCallendar(auth)});
}

main();
