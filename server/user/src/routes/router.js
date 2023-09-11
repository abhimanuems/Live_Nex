import { Router } from "express";
const router = Router();
import {
  razorpay,
  successFunction,
} from "../services/paymentServices.js";
import {youtubeAuth,oauthCallback } from "../services/oAuthservices.js"
import { protect } from "../../../shared/middileware/authmiddileware.js";
import {
  facebook,
  oauthCallbackFB,
  authFacebook,
} from "../services/facebook.js";

router.get("/orders", razorpay);

router.post("/success", successFunction);

router.get("/youtubeauth", protect,youtubeAuth);

router.get("/oauth2callback",oauthCallback);

router.get("/facebookauth", protect,facebook);

router.get("/oauth2callbackfb",oauthCallbackFB);

router.get("/authFacebook",authFacebook)


export default router;
