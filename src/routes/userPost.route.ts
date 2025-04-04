import express from 'express';
import userPostController from '../controllers/userPost.controller';
import { authenticateToken } from "../middlewares/authenticateToken"
import { Request, Response } from 'express';

const router = express.Router();

// Auth zorunlu middleware
router.post('/newPost', authenticateToken, userPostController.addUserPost);
router.get('/getUserPosts', authenticateToken, userPostController.getUserPosts);
router.delete('/deleteUserPost/:postId', authenticateToken, userPostController.deleteUserPost);
router.get("/test", (req: Request, res: Response) => {
    res.send("userPosts route çalışıyor");
  });

  router.delete("/test-delete/:id", (req, res) => {
    res.send(`Silinecek ID: ${req.params.id}`);
  });
  
  
export default router;
