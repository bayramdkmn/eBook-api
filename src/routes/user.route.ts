import express from 'express';
import UserController from '../controllers/user.controller';

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const router = express.Router();


router.post("/",UserController.createUser)
router.post("/login",UserController.loginUser)
router.post("/sendMail",UserController.sendMail)
router.post("/checkCode",UserController.checkCode)
router.post("/resetPassword",UserController.resetPassword)
router.post("/sendReport",UserController.sendReport)
router.get("/getUserById/:id", UserController.getUserById);
router.put("/updateProfile/:id", UserController.updateUserProfile);
router.put("/updatePassword/:id", UserController.updatePassword); 


export default router;
