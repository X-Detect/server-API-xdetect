import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateEmail, updatePassword} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, auth } from "../db-config/firebase-config.js";
import { sendPasswordResetEmail } from 'firebase/auth';
import { Storage } from '@google-cloud/storage';
import dotenv from "dotenv";
import axios from 'axios';
import { format } from "util";
dotenv.config();

const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    keyFilename: "db-config/serviceAccount.json",
});

// Handler signup
export const signUp = async(req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDoc = doc(db, 'users2', user.uid);
        await setDoc(userDoc, {
            name,
            email,
            phone,
            imgUrl: '',
            profilePicture: '',
        });
        res.status(200).json({success:true, msg:'Berhasil SignUp, silakan SignIn'});
    } catch (error) {
        console.log('Error melakukan sign up:', error);
        if (error.code === 'auth/email-already-in-use') {
            res.status(400).json({success:false, msg:'Email sudah terdaftar'});
        }
    }
}

// Handler signin
export const signIn = async(req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        res.json({ success: true, msg:'Berhasil Sign In', data: {
            uid: user.uid, 
            email: user.email
        } });
    } catch (error) {
        res.status(404).json({succes: false, msg:'Error melakukan Sign In'});
    }
}

// Fungsi untuk mengunggah file gambar ke Google Cloud Storage
export const uploadProfilePicture = async(req, res) => {
    try {
        if (!req.file) { res.status(400).send('No file uploaded.'); return; }

    const imageFile = req.file;
    const bucket = storage.bucket('xdetect-img-profile');
    const fileName = Date.now() + '_' + imageFile.originalname;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
        metadata: {
        contentType: imageFile.mimetype,
        },
    });

    stream.on('error', (error) => {
        console.error('Error uploading file:', error);
        res.status(500).send('Internal Server Error');
    });

    stream.on('finish', async () => {
    // Dapatkan URL publik file yang diunggah
    const [url] = await fileUpload.getSignedUrl({
        action: 'read',
        expires: '01-01-2025', // Tanggal kadaluarsa URL publik
    });

    res.status(200).json({
        status: 'Success',
        message: 'Profile picture berhasil ditambahkan',
        fileName,
        url,
        });
    });

    stream.end(imageFile.buffer);
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Upload PP dengan UID
export const uploadProfilePictureWithUID = async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
      }
  
      const { uid } = req.body;
      const imageFile = req.file;
      const bucket = storage.bucket('xdetect-img-profile');
      const fileName = `${Date.now()}_${imageFile.originalname}`;
      const fileUpload = bucket.file(fileName);
  
      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: imageFile.mimetype,
        },
      });
  
      stream.on('error', (error) => {
        console.error('Error uploading file:', error);
        res.status(500).send('Internal Server Error');
      });
  
      stream.on('finish', async () => {
        // Dapatkan URL publik file yang diunggah
        const [url] = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '01-01-2025',
        });
  
        // Update URL gambar profil pengguna di database
        try {
          const userDoc = doc(db, 'users2', uid);
          await updateDoc(userDoc, { imgUrl: url, profilePicture: url });
          console.log('Profile picture URL updated in the database');
        } catch (error) {
          console.error('Error updating profile picture URL in the database:', error);
        }
  
        res.status(200).json({
          status: 'Success',
          message: 'Profile picture berhasil ditambahkan',
          fileName,
          url,
        });
      });
  
      stream.end(imageFile.buffer);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Internal Server Error');
    }
};


// Handler reset password
export const resetPassword = async(req, res) => {
    const { email } = req.body;
    try {
        await sendPasswordResetEmail(auth, email);
        console.log('Link reset email telah dikirimkan ke:', email);
        return res.status(200).json({msg: "Link Reset Password Telah Dikirim Ke Email"});
    } catch (error) {
        return res.status(200).json({msg: "Error melakukan reset password"});
    }
}


// Handler signout
export const signOutUser = async(req, res) => {
    try {
        await signOut(auth);
        return res.status(200).json({msg: "Sign out Berhasil"});
    } catch (error) {
        console.log('Error melakukan sign out:', error);
        return res.status(500).json({msg: "Gagal Melakukan Sign Out"});
    }
}

// Handler /users

// Handler /user/{uid}

// Handler prediksi
export const predict = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
    }

    const imageFile = req.file;
    const bucketName = 'xdetect-upload-image';
    const fileName = Date.now() + '_' + imageFile.originalname;
    const bucket = storage.bucket(bucketName);
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: imageFile.mimetype,
      },
    });

    stream.on('error', (error) => {
      console.error('Error uploading file:', error);
      res.status(500).send('Internal Server Error');
    });

    stream.on('finish', async () => {
      // Dapatkan URL publik file yang diunggah
      const [url] = await fileUpload.getSignedUrl({
        action: 'read',
        expires: '01-01-2025', // Tanggal kadaluarsa URL publik
      });

      // Panggil endpoint API untuk prediksi
      const predictionUrl = 'https://xray-prediction-akdfifaocq-et.a.run.app/predict';

      try {
        const response = await axios.post(predictionUrl, { image: url });
        const predictionResult = response.data;

        res.status(200).json(predictionResult);
      } catch (error) {
        console.error('Error calling prediction API:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    stream.end(imageFile.buffer);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal Server Error');
  }
};