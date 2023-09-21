import { Router } from "express";
import {
  razorpay,
  successFunction,
  checkSubscription,
} from "../Controllers/paymentservices.js";
import {
  youtubeAuth,
  oauthCallback,
  accessTokenYoutube,
  getRTMPYT,
  getYTcomments,
} from "../Controllers/oAuthservices.js";
import { protect } from "../../../shared/middileware/authmiddileware.js";
import {
  facebook,
  oauthCallbackFB,
  getFbAccessToken,
  getFbComments,
  getRTMPFB,
} from "../Controllers/facebook.js";

const service = Router();

service.get("/orders",protect, razorpay);

service.post("/success", protect, successFunction);

service.get("/subscription",protect,checkSubscription);

service.get("/youtubeauth", protect, youtubeAuth);

service.get("/oauth2callback", oauthCallback);

service.get("/facebookauth", protect, facebook);

service.get("/oauth2callbackfb",protect, oauthCallbackFB);

service.get("/fbtoken", protect,getFbAccessToken);

service.get("/fbcomments", protect,getFbComments);

service.get("/rtmpFB", protect, getRTMPFB);

service.get("/rtmpYoutube",protect,getRTMPYT)

service.post("/youtubeaccesstoken", protect, accessTokenYoutube);

service.get("/youtubecomments",protect,getYTcomments)
export default service;
