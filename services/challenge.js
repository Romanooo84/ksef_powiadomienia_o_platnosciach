import 'dotenv/config';
import axios from 'axios';


const KSEF_URL = process.env.KSEF_URL;


// pobieranie challenge
async function getChallenge() {
  const res = await axios.post(`${KSEF_URL}/auth/challenge`, null, {
    headers: { "Content-Type": "application/json" },
    // timeout opcjonalnie:
    timeout: 30000,
  });
  return res.data; // { challenge, timestamp, ... }
}



export default getChallenge