import express from 'express';
import BooksController from "../controllers/books.controller";

const router = express.Router();

// Takas taleplerini listelemek için GET isteği
router.get('/', BooksController.getSwapBook);

// Yeni takas talebi oluşturmak için POST isteği
router.post('/', BooksController.createSwapRequest);

// Takas talebinin durumunu güncellemek için PUT isteği
router.put('/:swapRequestId', BooksController.updateSwapRequestStatus);

export default router;