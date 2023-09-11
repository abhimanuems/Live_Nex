import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });
import { google } from "googleapis";
import axios from 'axios';


let broadcastId;
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
    const date = new Date(tokens.expiry_date);
    const currentDate = date.toLocaleString();

    console.log(currentDate);
    oauth2Client.setCredentials(tokens);
    getBroadCastId();
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
const liveBroadcast = {
  snippet: {
    title: "My Live Stream",
    description: "Description of your live stream",
    scheduledStartTime: `${new Date().toISOString()}`,
  },
  contentDetails: {
    recordFromStart: true,
    enableAutoStart: false,
    monitorStream: {
      enableMonitorStream: false,
    },
  },
  status: {
    privacyStatus: "public",
    selfDeclaredMadeForKids: true,
  },
};
 function getBroadCastId (){
   youtube.liveBroadcasts.insert(
     {
       part: "snippet,contentDetails,status",
       resource: liveBroadcast,
     },
     async (err, res) => {
       if (err) {
         console.error(`Error creating live broadcast: ${err}`);
       } else {
         broadcastId = res.data.id;
         //  console.log(`Broadcast ID: ${broadcastId}`);
         //  getIngestionInfo();
       
         getStreamId(broadcastId);
        //  getRTMPurl(broadcastId);
         // You can now use this broadcastId for streaming
       }
     }
   );
}

async function getStreamId(broadcastId){
  const listStreamsResponse = await youtube.liveBroadcasts.list({
    part: "id,contentDetails,snippet",
    id: broadcastId,
  }).then((res)=>{
    console.log("response is ",res);
    console.log(res.data.items)
  }).catch((err)=> {throw err})

  // Extract the boundStreamId
  // const boundStreamId =
  //   listStreamsResponse.data.items[0]?.contentDetails?.boundStreamId;
}



async function getRTMPurl(broadcastId) {

  youtube.liveBroadcasts.bind(
    {
      part: "id,contentDetails,snippet",
      id: broadcastId,
    },
    (err, res) => {
      if (err) {
        console.error(`Error binding broadcast to stream: ${err}`);
      } else {
       
       const ingestionInfo =
         res.data.contentDetails.monitorStream?.boundStreamId;
         console.log("ingestuon info is ",ingestionInfo)
      

        // Now you need to use the boundStreamId to get the RTMP URL and stream name
        // youtube.liveStreams.list(
        //   {
        //     part: "cdn",
        //     id: ingestionInfo,
        //     filter: "id",
        //   },
        //   (err, res) => {
        //     if (err) {
        //       console.error(`Error getting RTMP URL and stream name: ${err}`);
        //     } else {
        //       console.log("result from the live stream list",res);
        //         const snippet = res.data?.items[0]?.cdn;
        //         const rtmpUrl = res?.cdn?.ingestionInfo?.ingestionAddress;
        //         const streamName = snippet?.cdn?.ingestionInfo?.streamName;

        //         console.log("RTMP URL:", rtmpUrl);
        //     }
        //   }
        // );
      }
    }
  );
}




export { oauthCallback, youtubeAuth };