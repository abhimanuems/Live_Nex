import express from 'express'
import path from "path";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'
import { fileURLToPath } from "url";
import router from "./routes/router.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
const app = express();
app.use(cookieParser());
app.use(express.json({ extended: false }));
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected user!"));

app.use('/',router)

app.listen(process.env.PORT, () =>
  console.log(`server started at ${process.env.PORT}`)
);