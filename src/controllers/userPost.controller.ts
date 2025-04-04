import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

async function addUserPost(req: Request, res: Response, next: NextFunction) {
  const { title, content } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: 'Kullanıcı doğrulanamadı.' });
    return;
  }

  if (!title || !content) {
    res.status(400).json({ error: 'Başlık ve içerik zorunludur.' });
    return;
  }

  try {
    const newPost = await prisma.posts.create({
      data: { title, content, userId },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Post oluşturulurken hata:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
}

async function getUserPosts(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: 'Kullanıcı doğrulanamadı.' });
    return;
  }

  try {
    const posts = await prisma.posts.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
      },
    });
    

    res.status(200).json(posts);
  } catch (error) {
    console.error('Gönderiler alınırken hata:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
}

async function deleteUserPost(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.userId;
  const postId = req.params.postId;

  if (!userId) {
    res.status(401).json({ error: 'Kullanıcı doğrulanamadı.' });
    return;
  }

  if (!postId) {
    res.status(400).json({ error: 'Post ID gerekli.' });
    return;
  }

  try {
    const existingPost = await prisma.posts.findUnique({
      where: { id: postId },
    });

    if (!existingPost || existingPost.userId !== userId) {
      res.status(403).json({ error: 'Bu postu silme yetkiniz yok.' });
      return;
    }

    const deletedPost = await prisma.posts.delete({
      where: { id: postId },
    });

    res.status(200).json(deletedPost);
  } catch (error) {
    console.error('Post silinirken hata:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
}



export default {
  addUserPost,
  getUserPosts,
  deleteUserPost,
};
