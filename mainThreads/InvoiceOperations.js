import auth from '../services/KsefAuth.js';
import downloadInvoiceMetadata from '../operations/downloadInvoiceMetadata.js';
import downloadInvoiceXml from '../operations/downloadXMLInvoice.js';
import refreshKsefToken from '../services/auth/refershToken.js';
import readFileXml from '../operations/readFileXml.js';
import cron from 'node-cron'
import "dotenv/config";
import log from '../operations/saveAndLog.js';

let accessTokenKsef;
let refreshTokenKsef;

const invoiceOperations = async (time) => {
  log('pobieram Klucze')
  log("Uruchamiam zadanie pobierania danych z KSeF...");
  const accessTokenData = async () => {
  const { accessToken, refreshToken} = await auth();
  accessTokenKsef = accessToken;
  refreshTokenKsef = refreshToken;
}
  await accessTokenData();

  const path = "/invoices/query/metadata";

  cron.schedule(time, async () => {

    const now = new Date();

    const startDate = new Date(now);
    startDate.setUTCDate(startDate.getUTCDate() - 1);

    const endDate = new Date(now);
    endDate.setUTCDate(endDate.getUTCDate() - 2);

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate   = endDate.toISOString().split('T')[0];

    log(`Uruchamiam zadanie dla daty ${formattedStartDate} - ${formattedEndDate} z interwałem ${time}`);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subjectType: "subject2",
        dateRange: {
          dateType: "Invoicing",
          from: `${formattedEndDate}T00:00:00Z`,
          to:   `${formattedStartDate}T23:59:59Z`,
        },
      }),
    };
      
      try {
        log('pobieram metadane faktur KSeF...');
        
        let startData = await downloadInvoiceMetadata(
          accessTokenKsef,
          path,
          options
        );

        log("Sprawdzam status odpowiedzi...");
        if (startData === 401 || startData === 403) {
            log("Token wygasł, odświeżam...");
            accessTokenKsef = await refreshKsefToken(refreshTokenKsef);
            log("Token odświeżony, ponawiam próbę pobrania metadanych faktur KSeF...");
            startData = await downloadInvoiceMetadata(
              accessTokenKsef,
              path,
              options
            );
        }
        
        log("Pobieranie metadanych faktur KSeF zakończone.");
        if (startData!=null & startData != 401 & startData != 403 & startData != 429) {
            const invoiceNumbers = startData.invoices.map(
              invoice => invoice.ksefNumber
          );
          log(`Znaleziono ${invoiceNumbers.length} faktur.`);
          log(`Pobieranie XML faktur...`);

          for (const ksefNumber of invoiceNumbers) {
            let downloadResult

            while (true) {
              downloadResult = await downloadInvoiceXml(ksefNumber, accessTokenKsef);
              
            
              if (downloadResult.status === 429) {
                function sleep(ms) {
                  return new Promise(resolve => setTimeout(resolve, ms));
                }

                const seconds = Number(downloadResult.error?.match(/(\d+)\s*sekund/)?.[1]);
                log(`kod 429 – czekam ${seconds/60} minut`);
                await sleep(seconds * 1000);
                continue; // spróbuj jeszcze raz TEN SAM numer
              }

              break; // sukces albo inny błąd
            }
          } 
          
          await readFileXml();

          log("Pobieranie XML faktur zakończone.");
          log('pobrałem faktury')
        
        }
        } catch (error) {
          console.error("Błąd podczas pobierania metadanych faktur KSeF:", error);
          log(`Błąd podczas pobierania metadanych faktur KSeF: ${error.message}`);
          return
        } 
      }
      
 );  
};

export default invoiceOperations;
