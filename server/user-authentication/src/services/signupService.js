import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
const saltRounds = process.env.SALT_ROUNDS || 10;
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExits = await User.findOne({ email });
    if (userExits) {
      res.status(400).json("user exists");
    }
    else {
      bcrypt.hash(password, 10).then(async function (hash) {
        const user = await User.create({ email, password: hash })
        if (user) {
          res.status(201).json({ message: user });
        }
        else {
          res.status(400).json("invalid user data")
        }
      }).catch((err) => {
        console.log(err.message);
        if (err) throw err;
      })
    }
  } catch (err) {
    console.log(err.message);
    if (err) throw (err);
  }



};
export { signup, forgotPassword };
