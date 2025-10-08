import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const books = [
  {
    title: "Suç ve Ceza",
    author: "Fyodor Dostoyevski",
    genre: "Roman",
    description: "Rus edebiyatının en önemli eserlerinden biri. Raskolnikov'un psikolojik gerilimini anlatan başyapıt.",
    image: "https://images-na.ssl-images-amazon.com/images/I/71CcO-jvRUL.jpg"
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Distopya",
    description: "Totaliter bir rejimin gözetimi altındaki distopik bir dünyayı anlatan çarpıcı roman.",
    image: "https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg"
  },
  {
    title: "Yüzüklerin Efendisi",
    author: "J.R.R. Tolkien",
    genre: "Fantastik",
    description: "Orta Dünya'da geçen epik fantastik serinin ilk kitabı.",
    image: "https://images-na.ssl-images-amazon.com/images/I/71ZLavBjpRL.jpg"
  },
  {
    title: "Küçük Prens",
    author: "Antoine de Saint-Exupéry",
    genre: "Çocuk Edebiyatı",
    description: "Çocuklar için yazılmış, yetişkinlere hitap eden felsefi bir masal.",
    image: "https://images-na.ssl-images-amazon.com/images/I/71OZY035QKL.jpg"
  },
  {
    title: "Simyacı",
    author: "Paulo Coelho",
    genre: "Roman",
    description: "Kişisel efsanesinin peşinden giden çoban Santiago'nun yolculuğu.",
    image: "https://images-na.ssl-images-amazon.com/images/I/71zxW1eHYkL.jpg"
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: "Bilim Kurgu",
    description: "Arrakis çöl gezegeninde geçen epik bilim kurgu klasiği.",
    image: "https://images-na.ssl-images-amazon.com/images/I/71oKQ7P5L5L.jpg"
  },
  {
    title: "Sefiller",
    author: "Victor Hugo",
    genre: "Roman",
    description: "Jean Valjean'ın adaleti ve merhameti sorgulayan hikayesi.",
    image: "https://images-na.ssl-images-amazon.com/images/I/71hN4NpZtLL.jpg"
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    genre: "Distopya",
    description: "Kitapların yasaklandığı ve yakıldığı bir gelecekte geçen distopik roman.",
    image: "https://images-na.ssl-images-amazon.com/images/I/71OFqSRFDgL.jpg"
  },
  {
    title: "Hayvan Çiftliği",
    author: "George Orwell",
    genre: "Alegori",
    description: "Totaliter rejimleri eleştiren alegorik bir roman.",
    image: "https://images-na.ssl-images-amazon.com/images/I/71jYQY8s6FL.jpg"
  },
  {
    title: "Don Kişot",
    author: "Miguel de Cervantes",
    genre: "Roman",
    description: "Şövalye romanlarından etkilenen bir adamın trajikomik maceraları.",
    image: "https://images-na.ssl-images-amazon.com/images/I/71Wu+HxRH8L.jpg"
  },
  {
    title: "Otomatik Portakal",
    author: "Anthony Burgess",
    genre: "Distopya",
    description: "Şiddet ve özgür irade üzerine düşündüren distopik roman.",
    image: "https://images-na.ssl-images-amazon.com/images/I/71QKrHeWwOL.jpg"
  },
  {
    title: "Fareler ve İnsanlar",
    author: "John Steinbeck",
    genre: "Roman",
    description: "Büyük Buhran döneminde iki arkadaşın dramatik hikayesi.",
    image: "https://images-na.ssl-images-amazon.com/images/I/71K7ZDqnXlL.jpg"
  }
];

async function main() {
  console.log('Kitaplar ekleniyor...');
  
  for (const book of books) {
    await prisma.book.create({
      data: book
    });
  }
  
  console.log('Kitaplar başarıyla eklendi!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 