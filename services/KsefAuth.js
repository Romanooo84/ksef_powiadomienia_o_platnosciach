import getChallenge from './auth/challenge.js';
import getPublicKey from './auth/getpulbickey.js';
import cryptoToken from './auth/crypto.js';
import authKsefToken from './auth/authToken.js';
import getAuthStatus from './auth/authStatus.js';
import redeemAuthenticationToken from './auth/accesToken.js';
import "dotenv/config";



const auth = async () => {

let accessToken
let refreshToken

const challengeResponse = await getChallenge();
console.log("Otrzymano challenge KSeF");

const key = await getPublicKey();
console.log("Pobrano klucz publiczny KSeF.")

const token= cryptoToken(challengeResponse,key);
console.log("Wygenerowano zaszyfrowany token KSeF: ");

const dataToken = await authKsefToken(challengeResponse, token);

const { authToken, referenceNumber } = dataToken;

console.log("wygotowano token autoryzacyjny KSeF.");
console.log("authToken looks like JWT:", authToken.split(".").length === 3);

let authStatus;
while (true) {
  authStatus = await getAuthStatus(authToken, referenceNumber);

  const code = authStatus?.status?.code;

  if (code != 100) {
    break; 
  }
  console.log("Status autoryzacji KSeF: 100 (w trakcie). Czekam...");
 
  await new Promise(resolve => setTimeout(resolve, 1000));
}

console.log("Autoryzacja zakończona:");
const status = authStatus?.status?.code;

if (status === 200) {
  let accessTokenData;
  accessTokenData = await redeemAuthenticationToken(authToken)
  console.log("Uzyskano token dostępu KSeF.");

  accessToken = accessTokenData.accessToken;
  refreshToken = accessTokenData.refreshToken;
}

return { accessToken, refreshToken, referenceNumber };
}

export default auth;