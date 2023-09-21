import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import axios from "axios";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });
import User from "../models/userModels.js";
import {
  accessTokenFB,
  getUserIdFB,
  getRtmpUrlFB,
} from "../helpers/facebookHelper.js";

const facebook = async (req, res) => {
  try {
    const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.FACEBOOKID}&redirect_uri=${process.env.FACEBOOKAUTHREDIRECTURL}&scope=publish_video`;
    res.redirect(authUrl);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
const oauthCallbackFB = async (req, res) => {
  const userId = req.userEmail;
  const authorizationCode = req.query.code;
  if (!authorizationCode) {
    return res.status(400).send("Authorization code missing.");
  }

  await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $set: {
        "facebook.authorizationCode": authorizationCode,
      },
    }
  )
    .then((response) => {})
    .catch((err) => {
      console.error(err);
    });

  res.send(`
          <script>
            window.opener.postMessage('http://localhost:3000');
            window.close();
          </script>
        `);
};

const getFbAccessToken = async (req, res) => {
  try {
    const response = await accessTokenFB(req.userEmail);

    if (response) {
      const userId = await getUserIdFB(response.data.access_token);

      if (userId) {
        const rtmpUrl = await getRtmpUrlFB(
          userId,
          response.data.access_token,
          req.userEmail
        );
      }
      res.status(200).json(response.data.access_token);
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).json(err.message);
  }
};

const getFbComments = async (req, res) => {
  try {
    const result = await User.findOne({ _id: req.userEmail });
    const accessToken = result.facebook.accessToken;
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

    const liveVideoId = response.data.id;
    console.log("live id is ", liveVideoId);
    const liveComments = await axios.get(
      `https://streaming-graph.facebook.com/${liveVideoId}/live_comments`,
      {
        params: {
          access_token: accessToken,
        },
      }
    );
    const comments = liveComments.data.data;
    console.log("Live Video Comments:", comments);
    res.status(200).json(comments);
  } catch (err) {
    console.error("facebook error at live video", err.message);
  }
};

const getRTMPFB = async (req, res) => {
  try {
    const data = await User.findOne({ _id: req.userEmail });
    console.log(data.facebook.rtmpUrl);
    res.status(200).json(data.facebook.rtmpUrl);
  } catch (err) {
    console.error(err.message);
    res.status(400).json(err.message);
  }
};

export {
  facebook,
  oauthCallbackFB,
  getFbAccessToken,
  getFbComments,
  getRTMPFB,
};
