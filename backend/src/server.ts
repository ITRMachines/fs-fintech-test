import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { initializeDatabase } from './config/db';
import userRouter from './routes/userRoutes';
import errorHandler from './middleware/errorHandler';
import * as admin from 'firebase-admin';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize Firebase Admin SDK
admin.initializeApp();

app.use((req, res, next) => {
  console.log('Received Content-Type:', req.get('Content-Type'));
  next();
});
// Enable CORS for all origins
// app.use(cors({ origin: '*' }));
const corsOptions = {
  origin: 'http://localhost:3002', // Asegúrate que coincida con tu frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Manejo explícito de preflight
app.options('*', cors(corsOptions));
import bodyParser from 'body-parser';

app.use(express.json());
app.use(bodyParser.json({
  limit: '10mb',
  type: ['application/json', 'text/plain'] // Acepta más variantes
}));
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.use('/api/users', userRouter);
app.use(errorHandler);

// Start the server after database initialization
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});