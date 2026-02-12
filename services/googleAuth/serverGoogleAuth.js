import fs from "node:fs";
import { google } from "googleapis";
import log from "../../operations/saveAndLog.js";

export default function getGoogleAuthClient() {
  
  const credentials = JSON.parse(fs.readFileSync("./credentials.json", "utf8"));
  const token = JSON.parse(fs.readFileSync("./googleToken.json", "utf8"));

  const cfg = credentials.installed ?? credentials.web;
  const { client_id, client_secret, redirect_uris } = cfg;

  const client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris?.[0] || "http://localhost"
  );

  client.setCredentials(token);

  // opcjonalnie: zapisuj odświeżone tokeny
  client.on("tokens", (newTokens) => {
    fs.writeFileSync(
      "./googleTokenClient.json",
      JSON.stringify({ ...token, ...newTokens }, null, 2)
    );
  });
  log('zalogowane do Google')
  return client;
}
