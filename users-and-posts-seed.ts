import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const users = [
  {
    name: "Elif",
    surname: "Yıldız",
    email: "elif@example.com",
    password: "123456",
    username: "elifyildiz",
    gender: "Kadın",
    phone: "5556667788",
    address: "İstanbul, Maltepe",
    posts: [
      {
        title: "Suç ve Ceza Üzerine Düşünceler",
        content: "Dostoyevski'nin bu başyapıtında, Raskolnikov'un iç dünyasını ve psikolojik çatışmalarını çok etkileyici buldum. Özellikle suç ve vicdan kavramlarının işlenişi...",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"
      },
      {
        title: "Yeni Okuduğum Kitap: 1984",
        content: "George Orwell'ın distopik dünyası günümüz toplumuna ışık tutuyor. Gözetim toplumu ve düşünce kontrolü konularındaki öngörüleri...",
        image: "https://images.unsplash.com/photo-1549122728-f519709caa9c"
      }
    ]
  },
  {
    name: "Burak",
    surname: "Aydın",
    email: "burak@example.com",
    password: "123456",
    username: "burakaydin",
    gender: "Erkek",
    phone: "5557778899",
    address: "İstanbul, Bakırköy",
    posts: [
      {
        title: "Dune Serisine Başladım",
        content: "Frank Herbert'in yarattığı evren inanılmaz detaylı. Arrakis gezegenindeki yaşam ve Fremen kültürü özellikle etkileyici...",
        image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d"
      }
    ]
  },
  {
    name: "Selin",
    surname: "Arslan",
    email: "selin@example.com",
    password: "123456",
    username: "selinarslan",
    gender: "Kadın",
    phone: "5558889900",
    address: "İstanbul, Sarıyer",
    posts: [
      {
        title: "Küçük Prens'i Yeniden Okumak",
        content: "Her yaşta farklı anlamlar çıkardığım bir kitap. Bu sefer yetişkin gözüyle okuduğumda bambaşka mesajlar aldım...",
        image: "https://images.unsplash.com/photo-1514894780887-121968d00567"
      }
    ]
  },
  {
    name: "Mert",
    surname: "Çelik",
    email: "mert@example.com",
    password: "123456",
    username: "mertcelik",
    gender: "Erkek",
    phone: "5559990011",
    address: "İstanbul, Beykoz",
    posts: [
      {
        title: "Sefiller'den Unutulmaz Alıntılar",
        content: "Victor Hugo'nun bu başyapıtından en sevdiğim alıntıları derledim. Jean Valjean'ın dönüşüm hikayesi hepimize ilham veriyor...",
        image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353"
      }
    ]
  },
  {
    name: "Deniz",
    surname: "Korkmaz",
    email: "deniz@example.com",
    password: "123456",
    username: "denizkorkmaz",
    gender: "Kadın",
    phone: "5550001122",
    address: "İstanbul, Ataşehir",
    posts: [
      {
        title: "Fahrenheit 451 ve Günümüz",
        content: "Kitapların yakıldığı bir dünya düşünün... Ray Bradbury'nin bu distopyası, günümüz teknoloji bağımlılığıyla ilginç paralellikler gösteriyor...",
        image: "https://images.unsplash.com/photo-1526721940322-10fb6e3ae94a"
      },
      {
        title: "Beyazıt Kütüphanesi'nde Bir Gün",
        content: "Tarihi atmosferiyle büyüleyen bu kütüphanede geçirdiğim günü anlatmak istiyorum. Eski kitapların kokusu ve sessizliğin huzuru...",
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66"
      }
    ]
  }
];

async function main() {
  console.log('Yeni kullanıcılar ve postlar ekleniyor...');
  
  for (const user of users) {
    const { posts, ...userData } = user;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const createdUser = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        is_validated: true
      }
    });

    if (posts) {
      for (const post of posts) {
        await prisma.posts.create({
          data: {
            ...post,
            userId: createdUser.id
          }
        });
      }
    }
  }
  
  console.log('Yeni kullanıcılar ve postlar başarıyla eklendi!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 