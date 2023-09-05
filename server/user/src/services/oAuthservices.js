import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });
import { google } from "googleapis";


const oauth2Client = new google.auth.OAuth2(
  process.env.GCLIENTID,
  process.env.GCLIENTSECRET,
  process.env.CALLBACKURL
);
const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});
const youtubeAuth = async (req, res) => {
  console.log("enetered at the youtube auth");
  try {
 const authUrl = oauth2Client.generateAuthUrl({
   access_type: "online",
   scope: ["https://www.googleapis.com/auth/youtube"],
 });
 res.redirect(authUrl);
  } catch (err) {
    if (err) console.log(err.message);
    throw err;
  }
};
const oauthCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    console.log("token",tokens)
    oauth2Client.setCredentials(tokens);
    // res.status(200).json({response:"Authorization successful! You can now start streaming."});
     res.send(`
          <script>
            window.opener.postMessage('http://localhost:3000');
            window.close();
          </script>
        `);
  } catch (err) {
    console.error("Error in OAuth callback:", err.message);
    res.status(500).send("Error in OAuth callback");
  }
};
export { oauthCallback, youtubeAuth };