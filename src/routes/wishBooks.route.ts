import express from 'express';
import BooksController from "../controllers/books.controller";
import { authenticateToken } from '../middlewares/authenticateToken';
const router = express.Router();



router.get('/', authenticateToken, BooksController.getWishBooks);
router.post('/addWishBook', authenticateToken, BooksController.addWishBook)
router.delete('/:bookId', authenticateToken, BooksController.deleteWishBook);
router.post('/addWishBookById', authenticateToken, BooksController.addWishBookById);
// router.delete('/deleteReadingBook/:bookId', authenticateToken, BooksController.deleteReadingBook);

export default router;