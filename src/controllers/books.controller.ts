import { Request, Response,NextFunction } from 'express';
import prisma from '../lib/prisma';

async function addReadingBook(req:Request, res:Response, next:NextFunction) {
    const { bookTitle, author, genre, description=null,image = null } = req.body;
    const requesterId = req.user?.userId;
    if (!requesterId) {
      res.status(400).json({ error: 'Geçersiz kullanıcı' });
      return;
    }
    console.log("Kitap Başlığı:", bookTitle);
    console.log("Yazar:", author);
    console.log("Tür:", genre);
    if (!bookTitle || !author || !genre) {
      res.status(400).json({
        error: "Kitap başlığı, yazar ve tür bilgisi zorunludur.",
      });
      return;
    }
    

        try {
      let book = await prisma.book.findFirst({
        where:{
          title:{
            equals:bookTitle,
            mode:'insensitive'
          }
        }
      })
      if (!book) {
        if (!author || !genre || !description) {
          res.status(400).json({
            error: 'Kitap veritabanında bulunamadı. Yeni bir kitap eklemek için yazar, tür ve açıklama bilgileri gerekli.',
          });
          return;
        }
  
        book = await prisma.book.create({
          data: {
            title: bookTitle,
            author,
            genre,
            description,
            image
          },
        }); 
      }
      const existingBook = await prisma.readBook.findFirst({
        where:{
          userId:requesterId,
          bookId:book.id
        }
      })
      if(existingBook){
        res.status(400).json({ error: 'Bu kitap zaten okuma listenizde.' });
      return;
      }
      const newEntry = await prisma.readBook.create({
        data: {
          userId:requesterId,
          bookId: book.id,
        },
      });
  
      res.status(201).json({
        message: 'Kitap başarıyla eklendi.',
        book,
        readingList: newEntry,
      });
  } catch (error: any) {
    console.error("Prisma Hatası:", error);
    res.status(500).json({
      error: "Veritabanı hatası.",
      details: error.message,
    });
  }
  
}

async function getSwapBook (req: Request, res: Response){
    try {
        const swapRequest = await prisma.swapRequest.findMany({
            include:{
                requester:true,
                offeredBook:true
            }
        })
        res.status(200).json(swapRequest)
    } catch (err:any) {
        console.log(err)
        res.status(500).json({ error: 'Bir hata oluştu' });

    }
}


// Takas talebi oluşturma
async function createSwapRequest (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { content, bookTitle, status = 'pending' } = req.body;
  const requesterId = req.user?.userId;
  console.log("kitap adı: ",bookTitle)
  if (!requesterId) {
    res.status(400).json({ error: 'Geçersiz kullanıcı' });
    return;  
  }

  try {
    const offeredBook = await prisma.book.findMany({
      where:{
        title:{
          equals: bookTitle,
          mode: 'insensitive'
        }
      }
    })
    const user = await prisma.user.findUnique({
      where: { id: requesterId },
      select: {
        id: true,
        email: true,
        username: true, 
      },
    });
    const offeredBookName = offeredBook[0];

    if (!user) {
      res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      return;  
    }

    // Swap isteği oluşturuluyor
    const newSwapRequest = await prisma.swapRequest.create({
      data: {
        content,
        requesterId,
        offeredBookId:offeredBookName?.id,
        status,
      },
    });

    // Swap isteği ve kullanıcı bilgileri ile birlikte döndürme islemi
    res.status(200).json({
      swapRequest: newSwapRequest,
      user: user,  
    });

    console.log("Swap request başarılı",newSwapRequest,user);

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Bir hata oluştu' });
    next(err); 
  }
};



  // Takas talebinin durumunu güncelleme
async function updateSwapRequestStatus(req: Request, res: Response) {
    const { swapRequestId } = req.params;
    const { status } = req.body; // 'pending', 'accepted', 'rejected'
  
    try {
      // Durumu güncellenen takas talebini buluyoruz
      const updatedSwapRequest = await prisma.swapRequest.update({
        where: { id: swapRequestId },
        data: { status },
      });
  
      // Güncellenmiş takas talebini döndürüyoruz
      res.status(200).json(updatedSwapRequest);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: 'Bir hata oluştu' });
    }
  }
  

  export default {
    addReadingBook,
    createSwapRequest,
    updateSwapRequestStatus,
    getSwapBook
}
