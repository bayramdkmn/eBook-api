import express from 'express';
import BooksController from "../controllers/books.controller";
import { authenticateToken } from '../middlewares/authenticateToken';
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const router = express.Router();



router.get('/', BooksController.getSwapBook);
router.post('/createSwap', authenticateToken, BooksController.createSwapRequest);
router.put('/:swapRequestId', BooksController.updateSwapRequestStatus);
router.post('/addReadingBook', authenticateToken, BooksController.addReadingBook)

export default router;