import { Router } from "express";
const router = Router();
import {
  razorpay,
  successFunction,
} from "../services/paymentServices.js";
import {youtubeAuth,oauthCallback } from "../services/oAuthservices.js"
import { protect } from "../../../shared/middileware/authmiddileware.js";

router.post("/orders", razorpay);

router.post("/success", successFunction);

router.get("/youtubeauth",youtubeAuth);

router.get("/oauth2callback",oauthCallback);


export default router;
