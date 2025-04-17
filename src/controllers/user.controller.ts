import { Request, Response } from 'express';
import prisma from '../lib/prisma';
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const jwt = require('jsonwebtoken');
const mailjet = require ('node-mailjet')
const otpStorage: { [email: string]: string } = {};

const mj = mailjet.apiConnect(
    '50431a90b75721edc308d1b596a53152', 
    'd3e6ae20ba56ec25aa2b1f3e1288ad6a'
  );

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

            const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
            console.log(token);
            res.json({
                token,
                requesterId: user.id  
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function sendMail(req: Request, res: Response) {
    try {
        const email  = req.body.email;
        console.log(email);
        const generateRandomCode = (length = 6) => (Math.floor(Math.random() * Math.pow(10, length))).toString().padStart(length, '0');
        const otpCode = generateRandomCode(6);    
        console.log(otpCode)
        otpStorage[email] = otpCode;
      
        setTimeout(() => {
          delete otpStorage[email];
          console.log(`OTP for ${email} expired and removed from storage.`);
        }, 180000); 
        
        const sent = mj.post("send", { 'version': 'v3.1' }).request({
          "Messages": [
              {
                  "From": {
                      "Email": "eBookResett@gmail.com",
                      "Name": "eBook"
                  },
                  "To": [
                      {
                          "Email": email,
                      }
                  ],
                  "Subject": "Reset Password",
                  "HTMLPart": `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; padding: 20px;">
                          <h3 style="color: #333;">Merhaba,</h3>
                          <p style="color: #555;">Bu e-posta, şifrenizi sıfırlamanız için gönderilmiştir. Aşağıdaki kodu kullanarak işleminizi tamamlayabilirsiniz:</p>
                          <div style="font-size: 24px; font-weight: bold; color: #007BFF; text-align: center; margin: 20px 0;">${otpCode}</div>
                          <p style="color: #555;">Bu kod yalnızca bir kez kullanılabilir ve 3 dakika içinde geçerliliğini yitirecektir.</p>
                          <div style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
                              &copy; 2024 eBook. Tüm hakları saklıdır.
                          </div>
                      </div>
                  `,
              }
          ]
      });
      
    //   sent.then((result: any) => {
    //     console.log('Email sent:', result.body);
    //     res.status(200).json({ message: 'Email sent' });
    //   });

      sent.then((result: any) => {
        console.log('Email sent:', result.body);
        res.status(200).json({ message: 'Email sent' });
      }).catch((err: any) => {
        console.error('Error:', err.statusCode);
        res.status(400).json({ message: "Email couldn't be sent", error: err.message });
      }); 
      
    } catch (err: any) {
        console.error('Error:', err);
        res.status(400).json({ error: "Email couldn't be sent" });
        
    }
}

async function checkCode(req: Request, res: Response) {
    const email = req.body.email;
    const code = req.body.code;

    const storedCode = otpStorage[email]; 
    if (storedCode && storedCode === code) {
      res.status(200).send({ message: 'Code correct' });
      delete otpStorage[email]; 
      console.log('Code verified successfully!');
    } else {
      console.log('Invalid code.');
      res.status(500).json({ message: 'Invalid code' });
    }
}

export async function resetPassword(req: Request, res: Response) {
    const { email, newPassword } = req.body;
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  
    res.json({ message: "Şifreniz başarıyla güncellendi." });
}

async function sendReport(req: Request, res: Response) {
    try {
      const { email, problem, type } = req.body;
  
      const sent = mj.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "eBookResett@gmail.com",
              Name: "eBook"
            },
            To: [
              {
                Email: "bayramdikmenn@gmail.com"
              }
            ],
            Subject: `Complaint Type: ${type}`,
            HTMLPart: `
              <div>
                <p><strong>Sender Email:</strong> ${email}</p>
                <p><strong>${type}:</strong></p>
                <p>${problem}</p>
              </div>
            `,
            TrackOpens: "disabled",
            TrackClicks: "disabled"
          }
        ]
      });
         
  
      sent.then((result: any) => {
        console.log('Email sent:', result.body);
        res.status(200).json({ message: 'Email sent' });
      }).catch((err: any) => {
        console.error('Error:', err.statusCode);
        res.status(400).json({ message: "Email couldn't be sent", error: err.message });
      }); 
      
    } catch (err: any) {
        console.error('Error:', err);
        res.status(400).json({ error: "Email couldn't be sent" });
        
    }
}

async function getUserById(req: Request, res: Response) {
    const userId = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                address: true,
                phone: true,
                gender: true,
                username: true,
            }
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateUserProfile(req: Request, res: Response) {
  const { id } = req.params;
  const { name, surname, email, address, phone, gender, username } = req.body;

  try {
      const updatedUser = await prisma.user.update({
          where: { id },
          data: { name, surname, email, address, phone, gender, username },
      });
      res.status(200).json(updatedUser);
  } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Internal server error" });
  }
}

async function updatePassword(req: Request, res: Response) {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}



  
export default {
    createUser,
    loginUser,
    sendMail,
    checkCode,
    getUserById,
    resetPassword,
    sendReport,
    updateUserProfile,
    updatePassword
}