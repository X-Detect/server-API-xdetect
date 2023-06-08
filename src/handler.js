import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateEmail, updatePassword} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, auth } from "../db-config/firebase-config.js";
import { sendPasswordResetEmail } from 'firebase/auth';
import { Storage } from '@google-cloud/storage';
import dotenv from "dotenv";
dotenv.config();

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  keyFilename: "../db-config/serviceAccount.json",
});

import fs from 'fs';
import Path from'path';
const bucket = storage.bucket('xdetect-profile-picture');

// Handler signup


// Handler signin

// Handler upload profile picture

// Handler reset password

// Handler signout

// Handler /users

// Handler /user/{uid}

// Handler prediksi
