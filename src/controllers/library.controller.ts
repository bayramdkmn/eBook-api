import { Request, Response } from "express";
import prisma from "../lib/prisma";

const LibraryController = {


  async getLibrariesByBook(req: Request, res: Response) {
    const { bookId } = req.params;
  
    try {
      const libraryBooks = await prisma.libraryBook.findMany({
        where: { bookId },
        include: {
          library: true
        }
      });
  
      const libraries = libraryBooks.map(lb => ({
        ...lb.library,
        quantity: lb.quantity // Bu kütüphanedeki kitap adedi
      }));
  
      res.json(libraries);
    } catch (error) {
      console.error("getLibrariesByBook error:", error);
      res.status(500).json({ error: "Kitabı bulunduran kütüphaneler alınamadı." });
    }
  },

  async addBookToLibrary(req: Request, res: Response) {
    const { libraryId } = req.params;
    const { bookId, quantity } = req.body;
  
    try {
      const existing = await prisma.libraryBook.findFirst({
        where: { libraryId, bookId }
      });
  
      if (existing) {
        const updated = await prisma.libraryBook.update({
          where: { id: existing.id },
          data: {
            quantity: existing.quantity + quantity
          }
        });
        res.json(updated);  // <-- sadece res.json, return yok
        return;
      }
  
      const newLibraryBook = await prisma.libraryBook.create({
        data: {
          libraryId,
          bookId,
          quantity
        }
      });
  
      res.status(201).json(newLibraryBook);
    } catch (error) {
      console.error("addBookToLibrary error:", error);
      res.status(500).json({ error: "Kitap kütüphaneye eklenemedi." });
    }
  },

  async removeBookFromLibrary(req: Request, res: Response): Promise<void> {
    const { libraryId, bookId } = req.params;
  
    try {
      const libraryBook = await prisma.libraryBook.findFirst({
        where: { libraryId, bookId }
      });
  
      if (!libraryBook) {
        res.status(404).json({ error: "Kitap kütüphanede bulunamadı." });
        return;
      }
  
      await prisma.libraryBook.delete({
        where: { id: libraryBook.id }
      });
  
      res.json({ message: "Kitap kütüphaneden silindi." });
    } catch (error) {
      console.error("removeBookFromLibrary error:", error);
      res.status(500).json({ error: "Kitap kütüphaneden silinemedi." });
    }
  }, 

  async getBooksByLibrary(req: Request, res: Response) {
    const { libraryId } = req.params;
  
    try {
      const libraryBooks = await prisma.libraryBook.findMany({
        where: { libraryId },
        include: { book: true }
      });
  
      const booksWithQuantity = libraryBooks.map(lb => ({
        ...lb.book,
        quantity: lb.quantity
      }));
  
      res.json(booksWithQuantity);
    } catch (error) {
      console.error("getBooksByLibrary error:", error);
      res.status(500).json({ error: "Kütüphanedeki kitaplar alınamadı." });
    }
  },

  async createLibrary(req: Request, res: Response): Promise<void> {
    const { name, address, latitude, longitude } = req.body;
  
    try {
      const newLibrary = await prisma.library.create({
        data: {
          name,
          address,
          latitude,
          longitude
        }
      });
  
      res.status(201).json(newLibrary);
    } catch (error) {
      console.error("createLibrary error:", error);
      res.status(500).json({ error: "Kütüphane oluşturulamadı." });
    }
  },

  async deleteLibrary(req: Request, res: Response): Promise<void> {
    const { libraryId } = req.params;
  
    try {
      await prisma.library.delete({
        where: { id: libraryId }
      });
  
      res.json({ message: "Kütüphane başarıyla silindi." });
    } catch (error) {
      console.error("deleteLibrary error:", error);
      res.status(500).json({ error: "Kütüphane silinemedi." });
    }
  },

  async removeBookCountFromLibrary(req: Request, res: Response): Promise<void> {
    const { libraryId, bookId } = req.params;
  
    try {
      const libraryBook = await prisma.libraryBook.findFirst({
        where: { libraryId, bookId }
      });
  
      if (!libraryBook) {
        res.status(404).json({ error: "Kitap kütüphanede bulunamadı." });
        return;
      }
  
      if (libraryBook.quantity > 1) {
        // Quantity > 1 ise sadece azalt
        await prisma.libraryBook.update({
          where: { id: libraryBook.id },
          data: {
            quantity: libraryBook.quantity - 1
          }
        });
  
        res.json({ message: "Kitap adedi 1 azaltıldı." });
      } else {
        // Quantity 1 ise kaydı tamamen sil
        await prisma.libraryBook.delete({
          where: { id: libraryBook.id }
        });
  
        res.json({ message: "Kitap kütüphaneden tamamen silindi." });
      }
    } catch (error) {
      console.error("removeBookFromLibrary error:", error);
      res.status(500).json({ error: "Kitap kütüphaneden silinemedi." });
    }
},
async getLibrariesWithBooks(req: Request, res: Response): Promise<void> {
    try {
      const libraries = await prisma.library.findMany({
        include: {
          books: {
            include: {
              book: true
            }
          }
        }
      });
  
      const formattedLibraries = libraries.map((library) => ({
        id: library.id,
        name: library.name,
        lat: library.latitude,
        lng: library.longitude,
        books: library.books.map(lb => ({
          id: lb.id,
          title: lb.book.title
        }))
      }));
  
      res.json(formattedLibraries);
    } catch (error) {
      console.error("getLibrariesWithBooks error:", error);
      res.status(500).json({ error: "Kütüphaneler alınamadı." });
    }
  }
  
};



export default LibraryController;
