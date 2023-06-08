import  express from "express";
import { signIn, signUp } from "./handler.js";

const router = express.Router();

router.post('/Signup', signUp)
router.post('/Signin', signIn)


export default router;