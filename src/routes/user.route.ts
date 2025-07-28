import express from 'express';
import type { Request, Response } from 'express';
import UserController from '../controllers/user.controller';

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const router = express.Router();


router.get("/health", (req, res) => {
    res.json({ 
        status: "OK", 
        database_url: process.env.DATABASE_URL ? "EXISTS" : "MISSING",
        jwt_secret: process.env.JWT_SECRET ? "EXISTS" : "MISSING"
    });
});

router.post("/", UserController.createUser as express.RequestHandler)
router.post("/login", UserController.loginUser as express.RequestHandler)
router.post("/sendMail", UserController.sendMail as express.RequestHandler)
router.post("/checkCode", UserController.checkCode as express.RequestHandler)
router.post("/resetPassword", UserController.resetPassword as express.RequestHandler)
router.post("/sendReport", UserController.sendReport as express.RequestHandler)
router.get("/getUserById/:id", UserController.getUserById as express.RequestHandler)
router.put("/updateProfile/:id", UserController.updateUserProfile as express.RequestHandler)
router.put("/updatePassword/:id", UserController.updatePassword as express.RequestHandler); 


export default router;
