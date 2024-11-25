import { Request, Response } from 'express';
import prisma from '../lib/prisma';


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
async function createSwapRequest(req: Request, res: Response) {
    const { requesterId, offeredBookId, status = 'pending' } = req.body;
  
    try {
      // Yeni bir swapRequest oluşturuyoruz
      const newSwapRequest = await prisma.swapRequest.create({
        data: {
          requesterId,
          offeredBookId,
          status,
        },
      });
  
      // Yeni takas talebini başarılı şekilde döndürüyoruz
      res.status(201).json(newSwapRequest);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: 'Bir hata oluştu' });
    }
  }

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
    createSwapRequest,
    updateSwapRequestStatus,
    getSwapBook
}
