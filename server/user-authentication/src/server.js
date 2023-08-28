import express  from 'express';
import path  from "path"
import bodyParser  from "body-parser";
import dotenv from 'dotenv';
import cors from 'cors'
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
import router  from "./routes/router.js"
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected!"));

const app = express();
app.use(
  cors({
    origin: "http://localhost:8000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
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