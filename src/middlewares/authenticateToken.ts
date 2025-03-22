import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Kullanıcıyı tanımlamak için bir tür oluşturun
interface UserPayload extends JwtPayload {
    id: string;
    email: string;
}

// Request arayüzünü genişletin
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader);

    const token = authHeader && authHeader.split(' ')[1];
    console.log('Extracted Token:', token);

    if (!token) {
        res.status(401).json({ error: 'Yetkilendirme hatası: Token eksik.' });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token doğrulama hatası:', err);
            res.status(403).json({ error: 'Token doğrulama hatası.' });
            return;
        }

        console.log('Verified User:', user);
        req.user = user as UserPayload;
        next();
    });
};

