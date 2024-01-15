import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import router from "./routes";

require("dotenv").config();

// const MONGO_URL: string = process.env["MONGO_URL"]!;

const MONGO_URL = process.env["MONGO_URL"] as string;

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(9000, () => {
  console.log("Server running on http://localhost:9000");
});

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => {
  console.log(error);
});

app.use("/api/v1/", router());
