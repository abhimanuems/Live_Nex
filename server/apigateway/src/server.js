import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import cookieParser from 'cookie-parser'
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected!"));
import authRouter from '../src/routes/auth.js'
import service from '../src/routes/services.js'
import adminRouter from '../src/routes/admin.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  methods: "*",
  credentials: true
}));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use("/auth", authRouter);
// app.use("/stream", proxy("http://localhost:8200"));
app.use("/users", service);
app.use("/admin", adminRouter);

app.listen(process.env.PORTNUMBER, () =>
  console.log(`server started at ${process.env.PORTNUMBER}`)
);

