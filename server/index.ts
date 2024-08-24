import express, { Application } from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';

config();

const app: Application = express();
const port: number = Number(process.env.PORT) || 5000;

// Middleware
app.use(express.json());

// MongoDB connection
connect(process.env.MONGO_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.error(err));

// Define routes
// app.use('/api/your-route', require('./routes/yourRoute'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
