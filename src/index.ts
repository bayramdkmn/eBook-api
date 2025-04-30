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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
const port = "3000";

const server = http.createServer(app);

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
  // app.use('/api/event', EventRouter);
  // app.use('/api/messages', MessagesRouter);

  app.all('*', (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

  
  // app.listen(port, () => {
  //   console.log(`Server is listening on port ${port}`);
  // });
  const port = 3000;

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is listening on http://0.0.0.0:${port}`);
  });
  
  
}

main();
