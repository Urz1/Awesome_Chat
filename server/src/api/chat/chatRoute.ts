import { Router } from "express";
import { chatController } from "./chatController";

const chatRouter = Router();

// POST route for handling chat questions
chatRouter.post('/', (req, res) => chatController.getAnswer(req, res));

export default chatRouter;
