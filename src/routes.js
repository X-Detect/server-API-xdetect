import  express from "express";
import multer from "multer";
import { predict, resetPassword, signIn, signOutUser, signUp, uploadProfilePicture, uploadProfilePictureWithUID, postArticle, getAllArticles, getArticleByUID, getUsers, getUserUid } from "./handler.js";

const router = express.Router();
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/reset-password', resetPassword)
router.post('/signout', signOutUser)
router.post('/predict', upload.single('image'), predict)
router.post('/upload-profile-picture', upload.single('image'), uploadProfilePicture);
router.put('/upload/:uid', upload.single('image'), uploadProfilePictureWithUID);
router.post('/article', postArticle)
router.get('/article', getAllArticles)
router.get('/article/:uid', getArticleByUID)
router.get('/users', getUsers)
router.get('/users/:uid', getUserUid)





export default router;