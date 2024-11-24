import express, { Request, Response } from 'express';
import UserRouter from "./routes/user.route"

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
  // app.use('/api/event', EventRouter);
  // app.use('/api/messages', MessagesRouter);

  app.all('*', (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

  
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

main();
