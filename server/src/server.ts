import cors from "cors";
import express, { type Express } from "express";
import { pino } from "pino";
import { env } from "process";
import { healthCheckRouter } from "./api/healthCheckRouter";
import chatRouter from "./api/chat/chatRoute";
import auth_router from "./api/auth/authRoute";
import mongoose from "mongoose";
import  cookieparser from 'cookie-parser';


mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });


const logger = pino({ name: "server start" });
const app: Express = express();


app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieparser());


// Routes
app.use("/api", healthCheckRouter);
app.use('/api/chat',chatRouter)
app.use('/api/auth',auth_router)

export { app, logger };

