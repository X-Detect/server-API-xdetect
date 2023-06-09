import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateEmail, updatePassword} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, auth } from "../db-config/firebase-config.js";
import { sendPasswordResetEmail } from 'firebase/auth';
import { Storage } from '@google-cloud/storage';
import dotenv from "dotenv";
import { format } from "util";
dotenv.config();

const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    keyFilename: "./db-config/serviceAccount.json",
});

// Bucket untuk menyimpan image 
const bucket = storage.bucket('xdetect-upload-image');

// Handler signup
export const signUp = async(req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
            name,
            email,
            phone,
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
      if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
      }
  
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
export const predict = async(req, res) => {
    try {
    
    if (!req.file) {
        return res.status(400).send({ message: "Please upload a file!" });
    }
    
    // Create a new blob in the bucket and upload the file data.
    const blob = await bucket.file(req.file.originalname);
    const blobStream = await blob.createWriteStream({
        resumable: false,
    });
    
    blobStream.on("error", (err) => {
        res.status(500).send({ message: err.message });
    });
    
    blobStream.on("finish", async (data) => {
        // Create URL for directly file access via HTTP.
        const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
    
    try {
        // Make the file public
        await bucket.file(req.file.originalname).makePublic();
        } catch {
            return res.status(500).send({
            message:
                `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
            url: publicUrl,
        });
        }
    
        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
            url: publicUrl,
        });
        });
    
        blobStream.end(req.file.buffer);
    } catch (err) {
        res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
    }
}