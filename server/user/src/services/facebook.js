import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });
import axios from 'axios';


let authorizationCode;
let accesstoken;
let videoId;
let liveVideoId;
const userAccessToken = process.env.FACEBOOKACCESSTOKEN;
const userId = process.env.FACEBOOKID;
const facebook =async(req,res)=>{
    try{

       const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.FACEBOOKID}&redirect_uri=${process.env.FACEBOOKAUTHREDIRECTURL}&scope=publish_video`;
       res.redirect(authUrl);
    }catch(err){
        console.error(err);
        throw err
    }
}
const oauthCallbackFB = async (req, res) => {

    authorizationCode = req.query.code;
    if (!authorizationCode) {
      return res.status(400).send("Authorization code missing.");
    }
      res.send(`
          <script>
            window.opener.postMessage('http://localhost:3000');
            window.close();
          </script>
        `);
       await getAccessToken().then(async(accessToken)=>{
       await createLiveVideo(accessToken).then(async(liveVideoId) => {
        await getRTMPInfo(liveVideoId, accessToken)
        
       });
     })
     

};


async function getAccessToken() {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v12.0/oauth/access_token`,
      null,
      {
        params: {
          client_id: process.env.FACEBOOKID,
          redirect_uri: process.env.FACEBOOKAUTHREDIRECTURL,
          client_secret: process.env.FACEBOOKAPPSECRET,
          code: authorizationCode,
        },
      }
    );
    await axios
      .get(
        `https://graph.facebook.com/v12.0/me?fields=id&access_token=${response.data.access_token}`
      )
      .then(async(res) => {
        const userId = res.data.id;

        const postData = {
          status: "LIVE_NOW",
          title: "Today's Live Video",
          description: "This is the live video for today.",
        };
        
       axios
         .post(`https://graph.facebook.com/${userId}/live_videos`, null, {
           params: postData,
           headers: {
             Authorization: `Bearer ${response.data.access_token}`,
           },
         })
         .then((response) => {
           console.log("Live video posted successfully:", response.data);
         })
         .catch((error) => {
           console.error("Error posting live video:", error);
         });

      })
      .catch((error) => {
        console.error("Error fetching user data:", error.response.data);
      });

    return response.data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error.response.data);
    throw error;
  }
}








const authFacebook =async(req,res)=>{
}

 async function createLiveVideo(accessToken) {
   try {
     const response = await axios.post(
       `https://graph.facebook.com/v12.0/me/live_videos`,
       null,
       {
         params: {
           access_token: accessToken,
           status: "LIVE_NOW",
         },
       }
     );
     return response.data.id;
   } catch (error) {
     console.error("Error creating live video:", error.response.data);
     throw error;
   }
 }

 async function getRTMPInfo(liveVideoId, accessToken) {
   try {
   } catch (error) {
     console.error("Error getting RTMP info:", error.response.data);
     throw error;
   }
 }
export { facebook, oauthCallbackFB, authFacebook };