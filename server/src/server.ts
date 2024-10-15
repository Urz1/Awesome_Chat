import cors from "cors";
import express, { type Express } from "express";
import { pino } from "pino";
import { env } from "process";
import { healthCheckRouter } from "./api/healthCheckRouter";
import chatRouter from "./api/chat/chatRoute";
import auth_router from "./api/auth/authRoute";



const logger = pino({ name: "server start" });
const app: Express = express();


app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// Routes
app.use("/api", healthCheckRouter);
app.use('/api/chat',chatRouter)
app.use('/api/auth',auth_router)

export { app, logger };

