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
    const {userName,password} = req.body;
    if(userName ===process.env.adminUserName && password ===process.env.adminPassword){
        generateAdminToken(res, userName);
         res.status(200).json({ message: "login successfull",adminUserName:userName });
    }
    else{
        res.status(400).json({error:"invalid username or password"})
    }

     
  } catch (err) {
    console.error(err);
  }
};

const getUsers =async (req,res)=>{
  try{
      const users = await User.find();
      console.log(users)
      res.status(200).json({users});
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

const tickets =async(req,res)=>{
  try{
    User.aggregate([
      {
        $match: {
          tickets: { $ne: [] }, 
        },
      },
      {
        $project: {
          tickets: 1, 
          _id:0
        },
      },
    ])
      .then((data) => {
        res.status(200).json({ data });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });

  }catch(err){
    console.log("error at admin ticket",err.message);
    res.status(400).json({error:"error at fetching"});
  }
}


export {
  adminLogin,
  getUsers,
  banUser,
  unblock,
  subscriptionsDetails,
  tickets,
};