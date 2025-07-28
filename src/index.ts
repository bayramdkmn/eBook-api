import express, { Request, Response } from 'express';
import UserRouter from "./routes/user.route"
import swapBooksRouter from "./routes/swapBook.route"
import readingBooksRouter from "./routes/readingBooks.route"
import followRouter from "./routes/follow.route"
import userPostRouter from "./routes/userPost.route"
import wishBooksRouter from "./routes/wishBooks.route"
import booksRouter from "./routes/books.route"
import libraryBooksRouter from "./routes/libraryBooks.route"
import appointmentRouter from "./routes/appointment.route"

const app = express();
const cors = require('cors');
const http = require('http');

app.use(cors({
  origin: ['https://e-book-web-ebon.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

async function main() {
  app.use('/api/user', UserRouter);
  app.use('/api/swapRequest', swapBooksRouter)
  app.use('/api/userPosts', userPostRouter); 
  app.use('/api/follow', followRouter);
  app.use('/api/readingBooks', readingBooksRouter);
  app.use('/api/wishBooks', wishBooksRouter);
  app.use('/api/books', booksRouter)
  app.use('/api/library', libraryBooksRouter);
  app.use('/api/appointment', appointmentRouter)

  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK' });
  });

  app.all('*', (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    console.log('CORS enabled for:', ['https://e-book-web-ebon.vercel.app', 'http://localhost:3000']);
  });
}

main().catch(console.error);