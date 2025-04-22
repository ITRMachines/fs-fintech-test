
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

const firebaseConfig = {
  apiKey: "AIzaSyAtPfBiIIxChMmjn4zytJvxfpM8n9kdHvY",
  authDomain: "technical-test-cf6c9.firebaseapp.com",
  projectId: "technical-test-cf6c9",
  storageBucket: "technical-test-cf6c9.firebasestorage.app",
  messagingSenderId: "1095715918576",
  appId: "1:1095715918576:web:469ca60b3ecf0b5f35e835",
  measurementId: "G-RV2LQDR9TR"
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

console.log(admin);
console.log(firebaseConfig);


// Extend the Request interface to include the 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ error: 'Forbidden' });
  }
};

export default authenticate;
