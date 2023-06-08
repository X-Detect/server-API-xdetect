const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } = require('firebase/auth');
const { doc, setDoc, getDoc, updateDoc } = require('firebase/firestore');
const { getDownloadURL, ref, uploadBytes } = require('firebase/storage');
const { auth, db } = require('../db-config/firebase-config');
const { sendPasswordResetEmail } = require('firebase/auth');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  keyFilename: "../db-config/serviceAccount.json",
});

const fs = require('fs');
const Path = require('path');
const bucket = storage.bucket('xdetect-profile-picture');

// Handler signup

// Handler signin

// Handler upload profile picture

// Handler reset password

// Handler signout

// Handler /users

// Handler /user/{uid}

// Handler prediksi

module.exports = {

};