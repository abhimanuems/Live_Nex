import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import { getBroadCastId, getLiveChat } from "../helpers/youtubeHelper.js";
import User from "../models/userModels.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });


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
   
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
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
    const result  = await oauth2Client.getToken(code);
    const authorizeToken = result.tokens.access_token;
   const  refreshToken = result.tokens.refresh_token;    
    oauth2Client.setCredentials(result.tokens);
   
    
    res.send(`
      <script>
        window.opener.postMessage({ message: 'AuthenticationSuccessful', data: { authorizeToken: '${authorizeToken}' } }, 'http://localhost:3000');
        window.close();
      </script>
    `);
       
  } catch (err) {
    console.error("Error in OAuth callback:", err.message);
    res.status(500).send("Error in OAuth callback");
  }
};

const accessTokenYoutube=async(req,res)=>{
  try{
    const id = req.userEmail;
    const accessToken = req.body.authorizeToken;
     User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          "youtube.authorizeToken": accessToken,
        },
      }
    ).then((res)=>{
      console.log("aceesToken is ",res)
      getBroadCastId(accessToken, id, youtube);
    }).catch((err)=>{
      console.error(err.message);
    })

   
  }catch(err){
    console.err(err.message);
  }

}

const getRTMPYT =async(req,res)=>{
  try{
    const data = await User.findOne({ _id: req.userEmail });
    res.status(200).json(data.youtube.rtmpUrl);
  }catch(err){
    console.error(err.message)
    res.status(400).json("no rtmpurl")
  }
}

const getYTcomments = async(req,res)=>{
  try{
    const result = await User.findOne(
      { _id: req.userEmail },
      "youtube.broadcastId"
    );
   const liveChatId = result.youtube.liveChatId;
  const response =  getLiveChat(liveChatId);
  res.status(200).json({response})
  }catch(err){
    console.error(err.message);
  }
}




export {
  oauthCallback,
  youtubeAuth,
  accessTokenYoutube,
  getRTMPYT,
  getYTcomments,
};
