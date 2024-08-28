import express, { Application } from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import router from './controllers/messageController';
import raging from './rag';

config();
raging();

const app: Application = express();
const port: number = Number(process.env.PORT) || 5000;

// Middleware
app.use(express.json());

// MongoDB connection
connect(process.env.MONGO_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.error(err));

// Define routes
app.use('/api', router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
