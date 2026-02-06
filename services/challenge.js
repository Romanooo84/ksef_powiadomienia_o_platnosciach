import 'dotenv/config';
import axios from 'axios';


const KSEF_URL = process.env.KSEF_URL;
const KSEF_NIP = process.env.KSEF_NIP;


// pobieranie challenge
async function getChallenge() {
  const res = await axios.post(`${KSEF_URL}/auth/challenge`, {
    contextIdentifier: { type: "Nip", value: KSEF_NIP },
  }, {
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    timeout: 30000,
  });
  

  return res.data;
}



export default getChallenge