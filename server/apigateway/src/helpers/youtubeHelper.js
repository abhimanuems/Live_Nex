import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import axios from "axios";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });
import User from "../models/userModels.js";

const getBroadCastId = async (
  response,
  accessToken,
  id,
  youtube,
  title,
  description
) => {
  try {
    const liveBroadcast = {
      snippet: {
        title: title,
        description: description,
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
        selfDeclaredMadeForKids: false,
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
          response.status(403).json({ error: err });
        } else {
          const broadcastId = await res.data.id;

          await User.updateOne(
            { _id: id },
            {
              $set: {
                "youtube.broadcastId": broadcastId,
              },
            }
          ).then((res) => {
            console.log("broadcastid is database submision is ", res);
          });

          const stream_data = createYoutubeStreams(
            title,
            description,
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
  try {
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
        console.log(
          "ingestionAddress, streamName",
          streamName,
          ingestionAddress
        );

        const youtubeRTMURL = ingestionAddress + "/" + streamName;
        console.log("youtube rmtp url", youtubeRTMURL);
        await User.updateOne(
          { _id: userId },
          { $set: { "youtube.rtmpUrl": youtubeRTMURL } }
        );
        bindYoutubeBroadcastToStream(broadcastId, id, authorizeToken, userId);
        return {
          id: res.data.id,
          youtubeDestinationUrl: ingestionAddress + "/" + streamName,
        };
      })
      .catch((error) => {
        console.error(error.message);
      });

    return stream;
  } catch (err) {
    console.error(err.message);
  }
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
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          "youtube.liveChatId": liveChatId,
        },
      }
    );
    console.log("Live Chat ID: from binde streaming", liveChatId);
    await startStreaming(youtubeBroadcastId, youtubeAccessToken, userId);

    return response.data;
  } catch (error) {
    console.error("error message from  bind broadcast", error.message);
    throw error;
  }
};

const startStreaming = async (
  youtubeBroadcastId,
  youtubeAccessToken,
  userId
) => {
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
    .then(async (res) => {
      const liveChatId = res.data.snippet.liveChatId;
      await User.updateOne(
        { _id: userId },
        { $set: { "youtube.liveChatId": liveChatId } }
      );
    })
    .catch((err) => {
      console.log(err.response.data.error.errors);
    });

  console.log("youtube going live");
};

const stopStreaming = async (youtubeBroadcastId, youtubeAccessToken, res) => {
  const config = {
    headers: {
      Authorization: `Bearer ${youtubeAccessToken}`,
      Accept: "application/json",
    },
  };

  axios
    .post(
      `https://youtube.googleapis.com/youtube/v3/liveBroadcasts/transition?broadcastStatus=complete&id=${youtubeBroadcastId}&part=snippet%2Cstatus&key=${process.env.GOOGLE_API_KEY}`,
      config
    )
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err.response.data);
      res.status(400).json({ data: err.response.data });
    });
};

const getLiveChat = async (liveChatId, accessToken) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    };
    const part = "id,snippet,authorDetails";

    const chats = axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/liveChat/messages?key=${process.env.GOOGLEAPIKEY}&liveChatId=${liveChatId}&part=${part}`,
        {
          headers: headers,
        }
      )
      .then((response) => {
        console.log("Live chat from YouTube:", response?.data);
        console.log(
          "chat us ",
          response?.data?.items[0]?.snippet?.displayMessage
        );
        console.log(
          "chat us ",
          response?.data?.items[0]?.authorDetails?.displayName
        );
        return response?.data;
      })
      .catch((error) => {
        console.error("Error fetching live chat:", error);
      });
    return chats;
  } catch (err) {
    console.error("Error retieving  comment:", err.response?.data?.error);
  }
};

const postCommentsYouTube = async (liveChatId, accessToken, comment) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const data = {
      snippet: {
        liveChatId: liveChatId,
        type: "textMessageEvent",
        textMessageDetails: {
          messageText: comment,
        },
      },
    };

    axios
      .post(
        `https://youtube.googleapis.com/youtube/v3/liveChat/messages?key=${process.env.GOOGLEAPIKEY}&part=snippet`,
        data,
        {
          headers: headers,
        }
      )
      .then((response) => {
        console.log("Message posted successfully:", response.data);
        return response;
      })
      .catch((error) => {
        console.error("Error posting message:", error.response?.data?.error);
      });
  } catch (err) {
    console.error(err.message);
  }
};

export { getBroadCastId, getLiveChat, postCommentsYouTube, stopStreaming };
