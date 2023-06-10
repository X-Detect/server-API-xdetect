import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

// const firebaseConfig = {
//     apiKey: process.env.API_KEY,
//     authDomain: process.env.AUTH_DOMAIN,
//     projectId: process.env.PROJECT_ID,
//     storageBucket: process.env.STORAGE_BUCKET,
//     messagingSenderId: process.env.MESSAGING_SENDER_ID,
//     appId: process.env.APP_ID,
// };

const firebaseConfig = {
    apiKey: "AIzaSyBIFI1I9MvGe-5EUn1cnx42ccm67GILmNU",
    authDomain: "xdetect-api.firebaseapp.com",
    projectId: "xdetect-api",
    storageBucket: "xdetect-api.appspot.com",
    messagingSenderId: "1097004825071",
    appId: "1:1097004825071:web:e1a632da75e7e22c8f5e1a"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
