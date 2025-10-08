import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const users = [
  {
    name: "Ahmet",
    surname: "Yılmaz",
    email: "ahmet@example.com",
    password: "123456",
    username: "ahmetyilmaz",
    gender: "Erkek",
    phone: "5551112233",
    address: "İstanbul, Kadıköy"
  },
  {
    name: "Ayşe",
    surname: "Demir",
    email: "ayse@example.com",
    password: "123456",
    username: "aysedemir",
    gender: "Kadın",
    phone: "5552223344",
    address: "İstanbul, Beşiktaş"
  },
  {
    name: "Mehmet",
    surname: "Kaya",
    email: "mehmet@example.com",
    password: "123456",
    username: "mehmetkaya",
    gender: "Erkek",
    phone: "5553334455",
    address: "İstanbul, Üsküdar"
  },
  {
    name: "Zeynep",
    surname: "Şahin",
    email: "zeynep@example.com",
    password: "123456",
    username: "zeynepsahin",
    gender: "Kadın",
    phone: "5554445566",
    address: "İstanbul, Şişli"
  },
  {
    name: "Can",
    surname: "Öztürk",
    email: "can@example.com",
    password: "123456",
    username: "canozturk",
    gender: "Erkek",
    phone: "5555556677",
    address: "İstanbul, Beyoğlu"
  }
];

async function main() {
  console.log('Kullanıcılar ekleniyor...');
  
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
        is_validated: true
      }
    });
  }
  
  console.log('Kullanıcılar başarıyla eklendi!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 