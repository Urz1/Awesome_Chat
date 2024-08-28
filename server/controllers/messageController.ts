import { Router, Request, Response } from 'express';
import main from '../routes/messageRoutes';

const router = Router();


router.post('/', async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }
        
        const conversation = await main({Txtprompt:prompt});
        console.log(conversation)
        res.status(200).json({ message: 'Post request received', conversation });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});

export default router;
