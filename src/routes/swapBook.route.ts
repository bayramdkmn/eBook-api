import express from 'express';
import BooksController from "../controllers/books.controller";
import { authenticateToken } from '../middlewares/authenticateToken';
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const router = express.Router();



// Takas taleplerini listelemek için GET isteği
router.get('/', BooksController.getSwapBook);

// Yeni takas talebi oluşturmak için POST ist"eği
router.post('/createSwap',authenticateToken,BooksController.createSwapRequest);

// Takas talebinin durumunu güncellemek için PUT isteği
router.put('/:swapRequestId', BooksController.updateSwapRequestStatus);

router.post('/addReadingBook',authenticateToken,BooksController.addReadingBook)

export default router;