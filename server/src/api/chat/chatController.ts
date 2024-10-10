import { Response,Request} from "express"
import ChatService from "./chatService";

class ChatController   {
    public async getAnswer(req: Request, res: Response){
        const {question} = req.body
        console.log(question)
        if (!question){
            res.status(500).json("no question provided")
            return
        }
    
        res.writeHead(200, {
            "Content-Type": "text",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        });
    
        try {
             
            const responseStream = await ChatService(question);
            for await (const chunk of responseStream) {
                console.log(chunk)
                res.write(chunk)
            }
            res.end();
        } catch (error) {
            console.error("Error in RagConverse:", error);
            res.status(500).json({ error: "An error occurred while processing the question" });
        }
    
    }
}
    
export const chatController= new ChatController;