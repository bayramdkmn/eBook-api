import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const libraries = [
  {
    name: "Atatürk Kütüphanesi",
    address: "Millet Cad. No:150 Fatih/İstanbul",
    latitude: 41.0082,
    longitude: 28.9384
  },
  {
    name: "Beyazıt Devlet Kütüphanesi",
    address: "Beyazıt Mah. Çadırcılar Cad. No:1 Fatih/İstanbul",
    latitude: 41.0103,
    longitude: 28.9650
  },
  {
    name: "Orhan Kemal İl Halk Kütüphanesi",
    address: "Sıraselviler Cad. No:2 Beyoğlu/İstanbul",
    latitude: 41.0355,
    longitude: 28.9787
  }
];

async function main() {
  console.log('Kütüphaneler ve kitapları ekleniyor...');

  // Önce tüm kitapları al
  const books = await prisma.book.findMany();
  
  for (const library of libraries) {
    // Kütüphaneyi ekle
    const createdLibrary = await prisma.library.create({
      data: library
    });

    // Her kütüphaneye rastgele 5-8 kitap ekle
    const numberOfBooks = Math.floor(Math.random() * 4) + 5; // 5 ile 8 arası
    const selectedBooks = books
      .sort(() => Math.random() - 0.5) // Kitapları karıştır
      .slice(0, numberOfBooks); // İlk numberOfBooks kadar kitabı al

    // Seçilen kitapları kütüphaneye ekle
    for (const book of selectedBooks) {
      await prisma.libraryBook.create({
        data: {
          libraryId: createdLibrary.id,
          bookId: book.id,
          quantity: Math.floor(Math.random() * 3) + 1 // 1-3 arası rastgele miktar
        }
      });
    }
  }
  
  console.log('Kütüphaneler ve kitapları başarıyla eklendi!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 