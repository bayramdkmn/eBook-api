import { Request, Response } from 'express';
import prisma from '../lib/prisma';
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const jwt = require('jsonwebtoken');



async function createUser(req: Request, res: Response){
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await prisma.user.create({
            data:{
                name:req.body.name,
                surname:req.body.surname,
                email:req.body.email,
                gender:req.body.gender,
                phone:req.body.phone,
                username:req.body.username,
                address:req.body.address,
                password:hashedPassword
            }
        })
        if(user)
            res.send(200)
        else
            res.send(500)
    } catch (err:any) {
        console.error(err)
    }

}

async function loginUser(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        console.log(email, ",", password);
        
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: email }
                ]
            },
        });
        
        console.log(user);

        if (user && (await bcrypt.compare(password, user.password))) {
            console.log("Token oluşturuluyor");

            // Token oluşturuluyor ve userId, email gibi bilgileri payload'a ekliyoruz
            const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

            // `requesterId`'yi ve token'ı döndürüyoruz
            res.json({
                token,
                requesterId: user.id  // Burada user.id'yi `requesterId` olarak döndürüyoruz
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}


export default {
    createUser,
    loginUser
}