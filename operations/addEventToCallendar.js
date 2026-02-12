
import readFile from "./readJsonFile.js";
import {google} from 'googleapis';
import log from "./saveAndLog.js";


const addEventToCallendar = async (authorization) => {
  log('zaczynam wporwadzać dane do klanedarza')

  const calendar = google.calendar({version: 'v3', auth: authorization });

  const now = new Date();
  
  const startDate = new Date(now);
  startDate.setUTCDate(startDate.getUTCDate() + 1);

  const endDate = new Date(now);
  endDate.setUTCDate(endDate.getUTCDate() + 2);

  const formattedStartDate = startDate.toISOString().split('T')[0];
  const formattedEndDate   = endDate.toISOString().split('T')[0];
  

  const invoicesData = await readFile();
  const tempInvoicesData = Object.entries(invoicesData)
  for (const [numer, {terminPlatnosci, NazwaFirmy, kwota}] of tempInvoicesData) {
    const Value = Number(kwota);
    const exeeptions = "\"CARREFOUR POLSKA\" SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ"
    if(Number.isFinite(Value) && Value >0 && terminPlatnosci!=null && terminPlatnosci >= formattedStartDate && terminPlatnosci <= formattedEndDate && NazwaFirmy!=exeeptions) {
        const event = {
        summary: "nazwa firmy: " + NazwaFirmy, 
        description: "Przypomnienie o płatności faktury nr " + numer + " na kwotę " + kwota + " zł, termin płatności: " + terminPlatnosci,
        start: {
          dateTime: `${terminPlatnosci}T10:00:00+01:00`,
          timeZone: "Europe/Warsaw",
        },
        end: {
          dateTime: `${terminPlatnosci}T10:30:00+01:00`,
          timeZone: "Europe/Warsaw",
        },
        reminders: {
        useDefault: false,
        overrides: [
            {
              method: "popup",
              minutes: 24 * 60,
            },
          ],
        },
        attendees: [
        { email: "pisarska.miska@gmail.com" },
      ],
      };

          const res = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
          });
          log("Dodano wydarzenie:", res.data.htmlLink);
          log(`Dodano wydarzenie do kalendarza Google dla faktury nr ${numer} z terminem płatności ${terminPlatnosci} i kwotą ${kwota} zł.`);
      }
    }

    log('zakonczono aktualizacje kalendarza')
  }


export default addEventToCallendar;