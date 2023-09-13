import express from "express";
import proxy from "express-http-proxy";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import cookieParser from 'cookie-parser'
import cors from "cors";
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
app.use("/auth", proxy("http://localhost:8100"));
app.use("/stream", proxy("http://localhost:8200"));
app.use("/users", proxy("http://localhost:8300"));

app.listen(process.env.PORTNUMBER, () =>
  console.log(`server started at ${process.env.PORTNUMBER}`)
);

