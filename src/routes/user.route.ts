import express from 'express';
import { Request, Response, NextFunction } from 'express';
import UserController from '../controllers/user.controller';

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const router = express.Router();


// const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers['authorization'] as string;

//   // Authorization header'ı yoksa 401 hatası döner
//   if (!authHeader) return res.sendStatus(401); 

//   // Token'ı "Bearer" ön ekinden ayırıyoruz
//   const token = authHeader.split(' ')[1];

//   // Token yoksa 401 döner
//   if (!token) return res.sendStatus(401);

//   // Token'ı doğruluyoruz
//   jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
//       if (err) return res.sendStatus(403);  // Eğer doğrulama hatalıysa 403 döner

//       // Kullanıcı bilgilerini req.user'a ekliyoruz
//       req.user?=user;

//       // İşlem başarılıysa next() ile devam ediyoruz
//       next();
//   });
// };


router.post("/",UserController.createUser)
router.post("/login",UserController.loginUser)
router.post("/sendMail",UserController.sendMail)
router.post("/checkCode",UserController.checkCode)
router.post("/resetPassword",UserController.resetPassword)
router.post("/sendReport",UserController.sendReport)





// router.post(
//   '/getUserByUserName',
//   authenticateToken,
//   UserController.getUserByUserName
// );

// router.post('/sendResetPasswordCode', UserController.sendResetPasswordCode);

export default router;
