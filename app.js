import auth from './services/auth.js';
import downloadInvoiceMetadata from './operations/downloadInvoiceMetadata.js';
import downloadInvoiceXml from './operations/downloadXMLInvoice.js';
import refreshKsefToken from './services/auth/refershToken.js';
import readFileXml from './operations/readFileXml.js';
import cron from 'node-cron'
import "dotenv/config";

let accessTokenKsef;
let refreshTokenKsef;
let referenceNumberKsef;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const accessTokenData = async () => {
  const { accessToken, refreshToken, referenceNumber } = await auth();
  accessTokenKsef = accessToken;
  refreshTokenKsef = refreshToken;
  referenceNumberKsef = referenceNumber;
}
const main = async () => {
  await accessTokenData();


  const path = "/invoices/query/metadata";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subjectType: "subject2",
      dateRange: {
        dateType: "issue",
        from: "2026-02-02T00:00:00Z",
        to:   "2026-02-04T23:59:59Z",
      },
    }),
  };

  cron.schedule('*/1 * * * *', async () => {
    
    try {
      console.log('pobieram metadane faktur KSeF...');
      let startData = await downloadInvoiceMetadata(
        accessTokenKsef,
        path,
        options
      );

      console.log(startData)
      if (startData === 401 || startData === 403) {
          console.log("Token wygasł, odświeżam...");
        accessTokenKsef = await refreshKsefToken(refreshTokenKsef);
        console.log("Token odświeżony, ponawiam próbę pobrania metadanych faktur KSeF...");
        startData = await downloadInvoiceMetadata(
          accessTokenKsef,
          path,
          options
        );
      }
      
      console.log("Pobieranie metadanych faktur KSeF zakończone.");
      if (startData!=null & startData != 401 & startData != 403 & startData != 429) {
          const invoiceNumbers = startData.invoices.map(
            invoice => invoice.ksefNumber
        );
        console.log(`Znaleziono ${invoiceNumbers.length} faktur.`);
        console.log(`Pobieranie XML faktur...`);

        for (const ksefNumber of invoiceNumbers) {
          let downloadResult

          while (true) {
            downloadResult = await downloadInvoiceXml(ksefNumber, accessTokenKsef);

            if (downloadResult === 429) {
              console.log("⏸ KSeF 429 – czekam 5 minut...");
              await sleep(5 * 60 * 1000);
              continue; // spróbuj jeszcze raz TEN SAM numer
            }

            break; // sukces albo inny błąd
          }
        } 

         await readFileXml();

         console.log("Pobieranie XML faktur zakończone.");
       
      }
      } catch (error) {
        console.error("Błąd podczas pobierania metadanych faktur KSeF:", error);
        return
      } 
    }
    
  );  
};
main();
