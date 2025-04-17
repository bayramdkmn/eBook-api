import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

async function getAllBooks(req: Request, res: Response): Promise<any> {
  try {
    const books = await prisma.book.findMany();
    return res.status(200).json(books);
  } catch (error: any) {
    console.error("Kitapları getirirken hata:", error);
    return res.status(500).json({ error: "Bir hata oluştu." });
  }
}

async function getReadingBooks(req: Request, res: Response): Promise<any> {
  const requesterId = req.user?.userId;

  if (!requesterId) {
    return res.status(401).json({ error: "Kullanıcı doğrulanamadı." });
  }

  try {
    const readingList = await prisma.readBook.findMany({
      where: { userId: requesterId },
      include: { book: true },
    });

    return res.status(200).json(readingList.map((entry) => entry.book));
  } catch (error: any) {
    console.error("Okuma listesi hatası:", error);
    return res.status(500).json({ error: "Bir hata oluştu." });
  }
}

async function addReadingBook(req: Request, res: Response, next: NextFunction): Promise<any> {
  const { bookTitle, author, genre, description = "", image = null } = req.body;
  const requesterId = req.user?.userId;

  if (!requesterId) {
    return res.status(400).json({ error: 'Geçersiz kullanıcı' });
  }

  if (!bookTitle || !author || !genre) {
    return res.status(400).json({
      error: "Kitap başlığı, yazar ve tür bilgisi zorunludur.",
    });
  }

  try {
    let book = await prisma.book.findFirst({
      where: {
        title: {
          equals: bookTitle,
          mode: 'insensitive',
        },
      },
    });

    // Kitap bulunamadıysa, ekle ama description olmasa bile sorun etme
    if (!book) {
      book = await prisma.book.create({
        data: {
          title: bookTitle,
          author,
          genre,
          description: description || "", // null ya da undefined ise boş string
          image,
        },
      });
    }

    const existingBook = await prisma.readBook.findFirst({
      where: {
        userId: requesterId,
        bookId: book.id,
      },
    });

    if (existingBook) {
      return res.status(400).json({ error: 'Bu kitap zaten listenizde.' });
    }

    const newEntry = await prisma.readBook.create({
      data: {
        userId: requesterId,
        bookId: book.id,
      },
    });

    return res.status(201).json({
      message: 'Kitap başarıyla eklendi.',
      book,
      readingList: newEntry,
    });
  } catch (error: any) {
    console.error("Prisma Hatası:", error);
    return res.status(500).json({
      error: "Veritabanı hatası.",
      details: error.message,
    });
  }
}

async function addReadingBookById(req: Request, res: Response, next: NextFunction): Promise<any> {
  const { bookId } = req.body;
  const requesterId = req.user?.userId;
  if (!requesterId) {
    return res.status(400).json({ error: 'Geçersiz kullanıcı' });
  }
  try {
    const existingBook = await prisma.readBook.findFirst({
      where: {
        userId: requesterId,
        bookId: bookId,
      },
    });
    if (existingBook) {
      return res.status(400).json({ error: 'Bu kitap zaten listenizde.' });
    }
    const newEntry = await prisma.readBook.create({
      data: {
        userId: requesterId,
        bookId: bookId,
      },
    });
    return res.status(201).json({
      message: 'Kitap başarıyla eklendi.',
      readingList: newEntry,
    });
  } catch (error: any) {
    console.error("Prisma Hatası:", error);
    return res.status(500).json({
      error: "Veritabanı hatası.",
      details: error.message,
    });
  }
}

async function deleteReadingBook(req: Request, res: Response): Promise<void> {
  const requesterId = req.user?.userId;
  const { bookId } = req.params;

  if (!requesterId) {
     res.status(401).json({ error: "Kullanıcı doğrulanamadı." });
  }

  try {
    await prisma.readBook.delete({
      where: {
        userId_bookId: {
          userId: requesterId,
          bookId: bookId,
        },
      },
    });

     res.status(200).json({ message: "Kitap başarıyla silindi." });
  } catch (err: any) {
    console.error("Silme hatası:", err);
     res.status(500).json({ error: "Kitap silinirken bir hata oluştu." });
  }
}

async function getSwapBook(req: Request, res: Response): Promise<any> {
  try {
    const swapRequests = await prisma.swapRequest.findMany({
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            surname: true,
            username: true,
            avatar: true,
          },
        },
        offeredBook: true,
      },
    });

    return res.status(200).json(swapRequests);
  } catch (err: any) {
    console.error("Swap listesi hatası:", err);
    return res.status(500).json({ error: 'Bir hata oluştu' });
  }
}

async function createSwapRequest(req: Request, res: Response, next: NextFunction): Promise<any> {
  const { content, bookTitle, status = 'pending' } = req.body;
  const requesterId = req.user?.userId;

  if (!requesterId) {
    return res.status(400).json({ error: 'Geçersiz kullanıcı' });
  }

  try {
    const offeredBook = await prisma.book.findFirst({
      where: {
        title: {
          equals: bookTitle,
          mode: 'insensitive',
        },
      },
    });

    if (!offeredBook) {
      return res.status(404).json({ error: 'Kitap bulunamadı.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: requesterId },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const newSwapRequest = await prisma.swapRequest.create({
      data: {
        content,
        requesterId,
        offeredBookId: offeredBook.id,
        status,
      },
    });

    return res.status(200).json({
      swapRequest: newSwapRequest,
      user,
    });
  } catch (err: any) {
    console.error("Swap request hatası:", err);
    return res.status(500).json({ error: 'Bir hata oluştu' });
  }
}

async function updateSwapRequestStatus(req: Request, res: Response): Promise<any> {
  const { swapRequestId } = req.params;
  const { status } = req.body;

  try {
    const updatedSwapRequest = await prisma.swapRequest.update({
      where: { id: swapRequestId },
      data: { status },
    });

    return res.status(200).json(updatedSwapRequest);
  } catch (err: any) {
    console.error("Swap durumu güncellenemedi:", err);
    return res.status(500).json({ error: 'Bir hata oluştu' });
  }
}

async function getWishBooks(req: Request, res: Response): Promise<any> {
  const requesterId = req.user?.userId;

  if (!requesterId) {
    return res.status(401).json({ error: "Kullanıcı doğrulanamadı." });
  }

  try {
    const wishList = await prisma.wishList.findMany({
      where: { userId: requesterId },
      include: { book: true },
    });

    return res.status(200).json(wishList.map((entry) => entry.book));
  } catch (error: any) {
    console.error("Wish list hatası:", error);
    return res.status(500).json({ error: "Bir hata oluştu." });
  }
}

async function addWishBook(req: Request, res: Response, next: NextFunction): Promise<any> {
  const { bookTitle, author, genre, description = "", image = null } = req.body;
  const requesterId = req.user?.userId;

  if (!requesterId) {
    return res.status(400).json({ error: 'Geçersiz kullanıcı' });
  }

  if (!bookTitle || !author || !genre) {
    return res.status(400).json({
      error: "Kitap başlığı, yazar ve tür bilgisi zorunludur.",
    });
  }

  try {
    let book = await prisma.book.findFirst({
      where: {
        title: {
          equals: bookTitle,
          mode: 'insensitive',
        },
      },
    });

    if (!book) {
      book = await prisma.book.create({
        data: {
          title: bookTitle,
          author,
          genre,
          description: description || "", 
          image,
        },
      });
    }

    const existingBook = await prisma.wishList.findFirst({
      where: {
        userId: requesterId,
        bookId: book.id,
      },
    });

    if (existingBook) {
      return res.status(400).json({ error: 'Bu kitap zaten listenizde.' });
    }

    const newEntry = await prisma.wishList.create({
      data: {
        userId: requesterId,
        bookId: book.id,
      },
    });

    return res.status(201).json({
      message: 'Kitap başarıyla eklendi.',
      book,
      wishList: newEntry,
    });
  } catch (error: any) {
    console.error("Prisma Hatası:", error);
    return res.status(500).json({
      error: "Veritabanı hatası.",
      details: error.message,
    });
  }
}

async function addWishBookById(req: Request, res: Response, next: NextFunction): Promise<any> {
  const { bookId } = req.body;
  const requesterId = req.user?.userId;
  if (!requesterId) {
    return res.status(400).json({ error: 'Geçersiz kullanıcı' });
  }
  try {
    const existingBook = await prisma.wishList.findFirst({
      where: {
        userId: requesterId,
        bookId: bookId,
      },
    });
    if (existingBook) {
      return res.status(400).json({ error: 'Bu kitap zaten listenizde.' });
    }
    const newEntry = await prisma.wishList.create({
      data: {
        userId: requesterId,
        bookId: bookId,
      },
    });
    return res.status(201).json({
      message: 'Kitap başarıyla eklendi.',
      wishList: newEntry,
    });
  } catch (error: any) {
    console.error("Prisma Hatası:", error);
    return res.status(500).json({
      error: "Veritabanı hatası.",
      details: error.message,
    });
  }
}


async function deleteWishBook(req: Request, res: Response): Promise<void> {
  const requesterId = req.user?.userId;
  const { bookId } = req.params;

  if (!requesterId) {
     res.status(401).json({ error: "Kullanıcı doğrulanamadı." });
  }

  try {
    await prisma.wishList.delete({
      where: {
        userId_bookId: {
          userId: requesterId,
          bookId: bookId,
        },
      },
    });

     res.status(200).json({ message: "Kitap başarıyla silindi." });
  } catch (err: any) {
    console.error("Silme hatası:", err);
     res.status(500).json({ error: "Kitap silinirken bir hata oluştu." });
  }
}



export default {
  addReadingBook,
  addWishBook,
  createSwapRequest,
  addWishBookById,
  deleteWishBook,
  getAllBooks,
  getReadingBooks,
  deleteReadingBook,
  addReadingBookById,
  updateSwapRequestStatus,
  getSwapBook,
  getWishBooks
};
