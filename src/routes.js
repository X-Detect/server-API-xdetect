import  express from "express";
import multer from "multer";
import { predict, resetPassword, signIn, signOutUser, signUp, uploadProfilePicture } from "./handler.js";

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({}),
    limits: {
      fileSize: 1048576 * 10, // Batas ukuran file (10MB)
    },
});

router.post('/Signup', signUp)
router.post('/Signin', signIn)
router.post('/Resetpassword', resetPassword)
router.post('/Signout', signOutUser)
router.post('/Predict', upload.single('file'), predict)
// router.post('/user/:uid/profile-picture', uploadProfilePicture);
router.post('/user/:uid/profile-picture', upload.single('file'), uploadProfilePicture);



export default router;