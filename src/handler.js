import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateEmail, updatePassword} from "firebase/auth";
import { doc, setDoc, getDocs, getDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';
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
    keyFilename: "./db-config/serviceAccount.json",

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
            uid : user.uid,
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
          console.log('uid',uid);
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

// Handler untuk posting artikel
export const postArticle = async (req, res) => {
  const { imageURL, title, description, createdBy, content, sourceURL } = req.body;
  const requiredFields = ['imageURL', 'title', 'description', 'createdBy', 'content', 'sourceURL'];
  const missingFields = [];

  requiredFields.forEach(field => {
    if (!req.body[field]) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      msg: `Field berikut harus diisi: ${missingFields.join(', ')}`,
    });
  }

  try {
    const articleRef = doc(db, 'db-articles', generateUniqueID());
    await setDoc(articleRef, {
      imageURL,
      title,
      description,
      createdBy,
      createdAt: serverTimestamp(),
      content,
      sourceURL,
    });
    res.status(200).json({
      success: true,
      msg: 'Berhasil',
    });
  } catch (error) {
    console.log('Error posting article:', error);
    res.status(500).json({
      success: false,
      msg: 'Terjadi kesalahan, tunggu beberapa saat',
    });
  }
};

function generateUniqueID() {
  const prefix = 'xdetect-article-';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let uniqueID = '';

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters[randomIndex];
    uniqueID += randomCharacter;
  }

  return prefix + uniqueID;
}

// Handler untuk mendapatkan semua data article
export const getAllArticles = async (req, res) => {
  try {
    const articlesCollection = collection(db, 'db-articles');
    const articlesSnapshot = await getDocs(articlesCollection);
    const articles = [];

    articlesSnapshot.forEach((doc) => {
      const articleData = doc.data();
      const createdAt = articleData.createdAt.toDate();
      const formattedCreatedAt = createdAt.toLocaleString('en-ID', { timeZone: 'Asia/Jakarta' });
      articles.push({ id: doc.id, ...articleData, createdAt: formattedCreatedAt });
    });

    res.status(200).json({
      success: true,
      msg: 'Berhasil',
      data: articles,
    });
  } catch (error) {
    console.log('Error getting articles:', error);
    res.status(500).json({
      success: false,
      msg: 'Terjadi kesalahan, tunggu beberapa saat',
    });
  }
};

export const getArticleByUID = async (req, res) => {
  const { uid } = req.params;

  try {
    const articleDoc = doc(db, 'db-articles', uid);
    const docSnap = await getDoc(articleDoc);

    if (docSnap.exists()) {
      const articleData = docSnap.data();
      const createdAt = articleData.createdAt.toDate();
      const formattedCreatedAt = createdAt.toLocaleString('en-ID', { timeZone: 'Asia/Jakarta' });
      
      res.status(200).json({
        success: true,
        msg: 'Berhasil',
        data: {
          ...articleData,
          createdAt: formattedCreatedAt
        },
      });
    } else {
      res.status(404).json({
        success: false,
        msg: 'Artikel tidak ditemukan',
      });
    }
  } catch (error) {
    console.log('Error getting article:', error);
    res.status(500).json({
      success: false,
      msg: 'Terjadi kesalahan, tunggu beberapa saat',
    });
  }
};


// Handler get User
export const getUsers = async(req, res) => {
    try {
        const UsersCollection = collection(db, 'users2');
        const userSnapshot = await getDocs(UsersCollection);
        const users = [];
    
        userSnapshot.forEach((doc) => {
            const usersData = doc.data();
            users.push({ ...usersData });
        });
    
        res.status(200).json({
            success: true,
            msg: 'Berhasil',
            data: users,
        });
    } catch (error) {
        console.log('Error getting Users:', error);
        res.status(500).json({
            success: false,
            msg: 'Terjadi kesalahan, tunggu beberapa saat',
        });
    }
}

// Handler get User UID
export const getUserUid = async (req, res) => {
    const { uid } = req.params;
    try {
        const userDoc = doc(db, 'users2', uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
            const data = docSnap.data();
            res.status(200).json({
                success: true,
                msg: 'Berhasil',
                data
            });
        }
        res.status(404).json({
            success: false,
            msg: 'Users tidak ditemukan',
        });
    } catch (error) {
        console.log('Error mendapatkan data user:', error);
    }
};