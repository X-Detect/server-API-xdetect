import  express from "express";
import multer from "multer";
import { predict, resetPassword, signIn, signOutUser, signUp, uploadProfilePicture } from "./handler.js";

const router = express.Router();
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

router.post('/Signup', signUp)
router.post('/Signin', signIn)
router.post('/Resetpassword', resetPassword)
router.post('/Signout', signOutUser)
router.post('/Predict', upload.single('file'), predict)
router.post('/upload-profile-picture', upload.single('image'), uploadProfilePicture);




export default router;