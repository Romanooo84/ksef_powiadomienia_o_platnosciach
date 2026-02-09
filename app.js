import auth from './services/auth.js';
import downloadInvoiceMetadata from './operations/downloadInvoiceMetadata.js';
import downloadInvoiceXml from './operations/downloadXMLInvoice.js';
import refreshKsefToken from './services/auth/refershToken.js';
import readFileXml from './operations/readFileXml.js';
import cron from 'node-cron'
import "dotenv/config";

let accessTokenKsef;
let refreshTokenKsef;

const accessTokenData = async () => {
  const { accessToken, refreshToken } = await auth();
  accessTokenKsef = accessToken;
  refreshTokenKsef = refreshToken;
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
        from: "2026-02-01T00:00:00Z",
        to:   "2026-02-01T23:59:59Z",
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

      console.log(startData);

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
          await downloadInvoiceXml(ksefNumber, accessTokenKsef);
         }

         await readFileXml();

         console.log("Pobieranie XML faktur zakończone.");
        } 
      } catch (error) {
        console.error("Błąd podczas pobierania metadanych faktur KSeF:", error);
        return
      } 
    }
  )
};
main();
