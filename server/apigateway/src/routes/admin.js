import { Router } from "express";
import { adminAuthProtect } from "../../../shared/middileware/authmiddileware.js";
import {
  adminLogin,
  getUsers,
  banUser,
  unblock,
  subscriptionsDetails,
  tickets,
} from "../Controllers/admin.js";




const adminRouter = Router();

adminRouter.post('/login',adminLogin);

adminRouter.get("/users", adminAuthProtect,getUsers);

adminRouter.get("/banuser/:id", adminAuthProtect,banUser);

adminRouter.get("/unblock/:id",adminAuthProtect,unblock);

adminRouter.get("/subscription",adminAuthProtect,subscriptionsDetails)

adminRouter.get("/tickets", adminAuthProtect,tickets);


export default adminRouter


