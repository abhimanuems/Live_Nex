
import {Router} from"express";
import {
  login,
  Oauth,
  googleCallBack,
  logout,
} from "../services/loginServices.js";
import { signup, forgotPassword } from "../services/signupService.js";
const router = Router();
router.post('/login',login);
router.post('/signup',signup);
router.get('/google',Oauth);
router.get("/google/callback", googleCallBack);
router.get("/forgotpassword",forgotPassword)
router.get('/logout',logout)



export default router;