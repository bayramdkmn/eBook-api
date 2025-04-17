import express from 'express';
import BooksController from "../controllers/books.controller";
import { authenticateToken } from '../middlewares/authenticateToken';
const router = express.Router();


router.get('/', authenticateToken, BooksController.getAllBooks);

export default router;