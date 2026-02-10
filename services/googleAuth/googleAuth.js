import path from 'node:path';
import {authenticate} from '@google-cloud/local-auth';

// The scope for reading calendar events.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The path to the credentials file.
const projectRoot = path.resolve(process.cwd());
const CREDENTIALS_PATH = path.join(projectRoot, "credentials.json");

/**
 * Lists the next 10 events on the user's primary calendar.
 */
async function auth() {
  // Authenticate with Google and get an authorized client.
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  console.log("✅ Google authentication successful.");
  return auth
}

export default auth;