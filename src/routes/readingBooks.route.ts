import express from 'express';
import BooksController from "../controllers/books.controller";
import { authenticateToken } from '../middlewares/authenticateToken';
const router = express.Router();


router.get('/all', authenticateToken, BooksController.getAllBooks);
router.get('/', authenticateToken, BooksController.getReadingBooks);
router.post('/addReadingBook', authenticateToken, BooksController.addReadingBook)
router.delete('/deleteReadingBook/:bookId', authenticateToken, BooksController.deleteReadingBook);
router.post('/addReadingBookById', authenticateToken, BooksController.addReadingBookById);

export default router;