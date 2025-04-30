import { Request, Response } from "express";
import prisma from "../lib/prisma";

const AppointmentController = {
  async createAppointment(req: Request, res: Response) {
    const { userId, libraryBookId, startTime, endTime } = req.body;

    try {
      const conflict = await prisma.appointment.findFirst({
        where: {
          libraryBookId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          status: { not: "cancelled" }
        }
      });

      if (conflict) {
        res.status(400).json({ error: "Bu saat zaten dolu!" });
      }

      const appointment = await prisma.appointment.create({
        data: {
          userId,
          libraryBookId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          status: "pending" 
        }
      });

      res.status(201).json(appointment);
    } catch (error) {
      console.error("createAppointment error:", error);
      res.status(500).json({ error: "Randevu oluşturulamadı." });
    }
  },

  async getAppointmentsForLibraryBook(req: Request, res: Response) {
    const { libraryBookId, date } = req.query;
  
    if (!libraryBookId || !date) {
    res.status(400).json({ error: "Eksik parametreler" });
    }
  
    try {
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);
  
      const endOfDay = new Date(date as string);
      endOfDay.setHours(23, 59, 59, 999);
  
      const appointments = await prisma.appointment.findMany({
        where: {
          libraryBookId: libraryBookId as string,
          startTime: {
            gte: startOfDay,
            lte: endOfDay
          },
          status: { not: "cancelled" }
        }
      });
  
      res.json(appointments);
    } catch (error) {
      console.error("getAppointmentsForLibraryBook error:", error);
      res.status(500).json({ error: "Randevular alınamadı." });
    }
  },

  async getUserAppointments(req: Request, res: Response) {
    const { userId } = req.params;
  
    if (!userId) {
    res.status(400).json({ error: "Kullanıcı ID'si eksik." });
    }
  
    try {
      const appointments = await prisma.appointment.findMany({
        where: {
          userId: userId,
          status: { not: "cancelled" },
        },
        orderBy: {
          startTime: 'asc'
        },
        include: {
          libraryBook: {
            include: {
              library: true,
              book: true,
            },
          },
        },
      });
  
      res.json(appointments);
    } catch (error) {
      console.error("getUserAppointments error:", error);
      res.status(500).json({ error: "Randevular alınamadı." });
    }
  },

  async cancelAppointment(req: Request, res: Response) {
    const { appointmentId } = req.params;
  
    try {
      const appointment = await prisma.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          status: "cancelled",
          cancelledAt: new Date(), 
        },
      });
  
      res.status(200).json(appointment);
    } catch (error) {
      console.error("cancelAppointment error:", error);
      res.status(500).json({ error: "Randevu iptal edilemedi." });
    }
  }
  
  
  
};

export default AppointmentController;
