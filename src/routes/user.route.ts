import express from 'express';
import UserController from '../controllers/user.controller';
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const router = express.Router();


// her fotoğraf için ayrı istek discord usuluü
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


router.post("/",UserController.createUser)
router.post("/login",UserController.loginUser)


// router.post(
//   '/getUserByUserName',
//   authenticateToken,
//   UserController.getUserByUserName
// );

// router.post('/sendResetPasswordCode', UserController.sendResetPasswordCode);

export default router;
