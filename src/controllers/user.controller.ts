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
            console.log("token");
            const token = jwt.sign({ userId: user.id }, JWT_SECRET);
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err: any) {
        console.error(err);
    }
}



export default {
    createUser,
    loginUser
}