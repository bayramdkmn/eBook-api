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

// CORS middleware - daha kapsamlı ayarlar
app.use(cors({
  origin: function (origin, callback) {
    // Tüm localhost portlarına ve production domain'e izin ver
    const allowedOrigins = [
      'https://e-book-web-ebon.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ];
    
    // Origin yoksa (Postman, curl gibi) veya allowed listesindeyse izin ver
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Manuel CORS header'ları ekle
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://e-book-web-ebon.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // OPTIONS preflight isteklerini handle et
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

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
    console.log('CORS enabled for:', ['https://e-book-web-ebon.vercel.app', 'http://localhost:3000', 'http://localhost:3001']);
    
  });
}

main().catch(console.error);