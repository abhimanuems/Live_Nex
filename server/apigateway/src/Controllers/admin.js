import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });
import { generateAdminToken } from "../../../shared/utils/generateToken.js";
import User from "../models/userModels.js";
const adminLogin = (req, res) => {
  try {
    const {username,password} = req.body;
    if(username ===process.env.adminUserName && password ===process.env.adminPassword){
        generateAdminToken(res, username);
         res.status(200).json({ message: "login successfull" });
    }
    else{
        res.status(400).json("invalid username or password")
    }

     
  } catch (err) {
    console.error(err);
  }
};

const getUsers =async (req,res)=>{
  try{
      const users = await User.find();
      console.log(users)
      res.status(200).json(users);
  }catch(err){
    console.error(err.message);
  }

}

const banUser = async(req,res)=>{
    try{
      const userId =  req.params.id;
    const response = await User.updateOne({ _id: userId }, { status: false });
    res.status(200).json({message:"baned successfully", userId})
   

    }catch(err){
        console.error(err,message);
         res.status(400).json({message:"internal error"})
    }
}
const unblock =async (req,res)=>{
    try{
        const userId = req.params.id;
        const response = await User.updateOne(
          { _id: userId },
          { status: true }
        );
       res.status(200).json({ message: "unblock successfull", userId });
    }catch(err){
        console.error(err.message)
        res.status(400).json({message:"internal error"});
    }

}

const subscriptionsDetails =async(req,res)=>{
    try{
        const date = new Date();
     const subscriptions = await User.find({ "razorpayDetails.endDate" : {$gte : date}});
     res.status(200).json({ subscriptions }); 
    }catch(err){
        console.error(err.message);
    }
}


export { adminLogin, getUsers, banUser, unblock, subscriptionsDetails };