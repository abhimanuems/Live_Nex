import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import axios from "axios";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });
import User from "../models/userModels.js";


const getBroadCastId = async (accessToken, id, youtube) => {
  try {
    const liveBroadcast = {
      snippet: {
        title: "My Live Stream",
        description: "Description of your live stream",
        scheduledStartTime: `${new Date().toISOString()}`,
      },
      contentDetails: {
        recordFromStart: true,
        enableAutoStart: true,
        monitorStream: {
          enableMonitorStream: true,
        },
        enableLiveChat: true,
      },
      status: {
        privacyStatus: "public",
        selfDeclaredMadeForKids: true,
      },
      cdn: {
        format: "720p",
        ingestionType: "rtmp",
      },
    };

    youtube.liveBroadcasts.insert(
      {
        part: "snippet,contentDetails,status",
        resource: liveBroadcast,
      },
      async (err, res) => {
        if (err) {
          console.error(`Error creating live broadcast: ${err}`);
        } else {
          const broadcastId = await res.data.id;
        

        await  User.updateOne(
            { _id: id },
            {
              $set: {
                "youtube.broadcastId": broadcastId,
              },
            }
          ).then((res)=>{
            console.log("broadcastid is database submision is ",res);
          })

          const stream_data = createYoutubeStreams(
            "test",
            "test",
            accessToken,
            broadcastId,
            id
          );
        }
      }
    );
  } catch (err) {
    console.error(err.message);
  }
};

const createYoutubeStreams = async (
  youtubeBroadcastTitle,
  youtubeBroadcastDescription,
  authorizeToken,
  broadcastId,
  userId
) => {
  const data = {
    snippet: {
      title: youtubeBroadcastTitle,
      description: youtubeBroadcastDescription,
    },
    cdn: {
      format: "",
      ingestionType: "rtmp",
      frameRate: "variable",
      resolution: "variable",
    },
    contentDetails: { isReusable: true },
  };

  const config = {
    headers: {
      Authorization: `Bearer ${authorizeToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const stream = await axios
    .post(
      `https://youtube.googleapis.com/youtube/v3/liveStreams?part=snippet%2Ccdn%2CcontentDetails%2Cstatus&key=${process.env.GOOGLEAPIKEY}`,
      data,
      config
    )
    .then(async (res) => {
   
      const { ingestionAddress, streamName } = res.data.cdn.ingestionInfo;
      const id = res.data.id;
      
      const youtubeRTMURL = ingestionAddress + "/" + streamName;
      await User.updateOne(
        { _id: userId },
        { $set: { "youtube.rtmpUrl": youtubeRTMURL } }
      );
      bindYoutubeBroadcastToStream(broadcastId, id, authorizeToken,userId);
      return {
        id: res.data.id,
        youtubeDestinationUrl: ingestionAddress + "/" + streamName,
      };
    })
    .catch((error) => {
      console.error(error.message);
    });

  return stream;
};



const bindYoutubeBroadcastToStream = async (
  youtubeBroadcastId,
  youtubeStreamId,
  youtubeAccessToken,
  userId
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${youtubeAccessToken}`,
      Accept: "application/json",
    },
  };

  try {
    const response = await axios.post(
      `https://youtube.googleapis.com/youtube/v3/liveBroadcasts/bind?id=${youtubeBroadcastId}&part=snippet&streamId=${youtubeStreamId}&access_token=${youtubeAccessToken}&key=${process.env.GOOGLEAPIKEY}`,
      {},
      config
    );
     const liveChatId = response.data.snippet.liveChatId;

     console.log("Live Chat ID: from binde streaming", liveChatId);
    //await startStreaming(youtubeBroadcastId, youtubeAccessToken);
    startStreaming(youtubeBroadcastId, youtubeAccessToken,userId);

    return response.data;
  } catch (error) {
    console.error("error message from  bind broadcast",error.message);
    throw error; 
  }
};




const startStreaming = async (youtubeBroadcastId, youtubeAccessToken,userId) => {



 const config = {
   headers: {
     Authorization: `Bearer ${youtubeAccessToken}`,
     Accept: "application/json",
   },
 };

 await axios
   .post(
     `https://youtube.googleapis.com/youtube/v3/liveBroadcasts/transition?broadcastStatus=live&id=${youtubeBroadcastId}&part=id&part=status&key=${process.env.GOOGLEAPIKEY}`,
     config
   )
   .then(async(res) => {
     const liveChatId = response.data.snippet.liveChatId;
      await User.updateOne(
        { _id: userId },
        { $set: { "youtube.liveChatId": liveChatId } }
      );

   })
   .catch((err) => {
     console.log(err.response.data.error.errors);
   });

console.log(  "youtube going live" );
};

// Usage:
// Assuming you have the youtubeBroadcastId and youtubeAccessToken
// Call startStreaming(youtubeBroadcastId, youtubeAccessToken) to start the stream.




const stopStreaming = async (youtubeBroadcastId, youtubeAccessToken) => {
  const config = {
    headers: {
      Authorization: `Bearer ${youtubeAccessToken}`,
      Accept: "application/json",
    },
  };

  try {
    const response = await axios.post(
      `https://youtube.googleapis.com/youtube/v3/liveBroadcasts/transition?broadcastStatus=complete&id=${youtubeBroadcastId}&part=snippet%2Cstatus&key=${process.env.GOOGLEAPIKEY}`,
      {},
      config
    );

  } catch (error) {
    console.error("error from create stream",error.message);
    throw error;
  }
};

const getLiveChat =async (liveChatId)=>{
  try{
 const response =
   await axios.get(`https://www.googleapis.com/youtube/v3/liveChat/messages?part=snippet%2CauthorDetails&liveChatId=${liveChatId}&key=${process.env.GOOGLEAPIKEY}
`);

 console.log("live chat from youtube", response);
 return response;

  }catch(err){
    console.error("error from yT", err.message);
  }
}



export { getBroadCastId, getLiveChat};