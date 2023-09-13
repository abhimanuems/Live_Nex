import express  from 'express';
import path  from "path"
import bodyParser  from "body-parser";
import dotenv from 'dotenv';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
import router  from "./routes/router.js"
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected!"));

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/',router)
app.listen(process.env.PORT, () =>
  console.log(`server started at ${process.env.PORT}`)
);