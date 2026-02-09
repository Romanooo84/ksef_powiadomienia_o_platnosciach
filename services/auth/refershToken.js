import "dotenv/config";

const KSEF_ACCESS_URL = process.env.KSEF_ACCESS_URL;

async function refreshKsefToken( refreshToken) {
  console.log("Odświeżanie tokena KSeF...");
  const url = `${KSEF_ACCESS_URL}/auth/token/refresh`;

  let res = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${refreshToken}`,
    },
  });

   if (!res.ok) {
    console.log("Błąd odświeżania tokena KSeF:", res.status, res.statusText);
   }
    
   const data = await res.json();

   console.log(data);

   return data.accessToken.token
}

export default refreshKsefToken;