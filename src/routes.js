import  express from "express";
import multer from "multer";
import { predict, resetPassword, signIn, signOutUser, signUp, uploadProfilePicture, uploadProfilePictureWithUID, postArticle, getAllArticles, getArticleByUID } from "./handler.js";

const router = express.Router();
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

router.post('/Signup', signUp)
router.post('/Signin', signIn)
router.post('/Resetpassword', resetPassword)
router.post('/Signout', signOutUser)
router.post('/Predict', upload.single('image'), predict)
router.post('/upload-profile-picture', upload.single('image'), uploadProfilePicture);
router.post('/upload/:uid', upload.single('image'), uploadProfilePictureWithUID);
router.post('/article', postArticle)
router.get('/article', getAllArticles)
router.get('/article/:uid', getArticleByUID)





export default router;