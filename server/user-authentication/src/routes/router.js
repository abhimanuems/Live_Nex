import {Router} from"express";
import {
  login,
  Oauth,
  googleCallBack,
  logout,
} from "../services/loginServices.js";
import { signup, getOtp } from "../services/signupService.js";

const router = Router();
router.post('/login',login);
router.post('/signup',signup);
router.get('/google',Oauth);
router.get("/google/callback", googleCallBack);
router.post("/otp",getOtp)
router.get('/logout',logout)



export default router;