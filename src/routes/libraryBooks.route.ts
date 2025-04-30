import express from 'express';
import LibraryController from "../controllers/library.controller";
import { authenticateToken } from '../middlewares/authenticateToken';

const router = express.Router();

router.get('/', authenticateToken, LibraryController.getLibrariesWithBooks);
router.post('/createLibrary', authenticateToken, LibraryController.createLibrary);
router.delete('/:libraryId', authenticateToken, LibraryController.deleteLibrary);
router.delete('/:libraryId', authenticateToken, LibraryController.removeBookFromLibrary);
router.get('/:libraryId/books', authenticateToken, LibraryController.getBooksByLibrary);
router.get('/book/:bookId/libraries', authenticateToken, LibraryController.getLibrariesByBook);
router.post('/:libraryId/books', authenticateToken, LibraryController.addBookToLibrary);
router.delete('/:libraryId/books/:bookId', authenticateToken, LibraryController.removeBookFromLibrary);


export default router;
