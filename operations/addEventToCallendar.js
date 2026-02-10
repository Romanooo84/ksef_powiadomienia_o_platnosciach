
import readFile from "./readJsonFile.js";
import {google} from 'googleapis';


const addEventToCallendar = async (authorization) => {

  const calendar = google.calendar({version: 'v3', auth: authorization });

  const invoicesData = await readFile();
  const tempInvoicesData = Object.entries(invoicesData)
  for (const [numer, {terminPlatnosci, NazwaFirmy, kwota}] of tempInvoicesData) {
    const Value = Number(kwota);
    if(Number.isFinite(Value) && Value >0){
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
        { email: "pisarski.roman@gmail.com" },
      ],
      };

          const res = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
          });
          console.log("Dodano wydarzenie:", res.data.htmlLink);
      }
    }
  }


export default addEventToCallendar;