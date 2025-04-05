import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getDiscoverFollow = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: "Kullanıcı doğrulanamadı." });
    return;
  }

  try {
    const followed = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followedIds = followed.map(f => f.followingId);
    followedIds.push(userId); 

    const posts = await prisma.posts.findMany({
      where: { userId: { in: followedIds } },
      include: {
        user: {
          select: {
            id:true,
            name: true,
            surname: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Feed alınırken hata:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const followUser = async (req: Request, res: Response): Promise<void> => {
    const followerId = req.user?.userId;
    const { followingId } = req.body;
  
    if (!followerId || !followingId) {
      res.status(400).json({ error: "Eksik bilgi" });
      return;
    }
  
    if (followerId === followingId) {
      res.status(400).json({ error: "Kendini takip edemezsin" });
      return;
    }
  
    try {
      const existingFollow = await prisma.follow.findFirst({
        where: {
          followerId,
          followingId,
        },
      });
  
      if (existingFollow) {
        res.status(400).json({ error: "Zaten takip ediyorsun" });
        return;
      }
  
      await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });
  
      res.status(200).json({ message: "Takip edildi" });
    } catch (err) {
      console.error("Takip hatası:", err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
};
  
export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
    const followerId = req.user?.userId;
    const followingId = req.params.userId;
  
    if (!followerId || !followingId) {
      res.status(400).json({ error: "Eksik bilgi" });
      return;
    }
  
    try {
      const follow = await prisma.follow.findFirst({
        where: {
          followerId,
          followingId,
        },
      });
  
      if (!follow) {
        res.status(404).json({ error: "Bu kullanıcıyı zaten takip etmiyorsun" });
        return;
      }
  
      await prisma.follow.delete({
        where: { id: follow.id },
      });
  
      res.status(200).json({ message: "Takipten çıkıldı" });
    } catch (err) {
      console.error("Takipten çıkma hatası:", err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
};

export const getFollowing = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
  
    if (!userId) {
      res.status(401).json({ error: "Kullanıcı doğrulanamadı." });
      return;
    }
  
    try {
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              surname: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
  
      const result = following.map(f => f.following);
  
      res.status(200).json(result);
    } catch (err) {
      console.error("Takip edilenler alınırken hata:", err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
};

export const getFollowers = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
  
    if (!userId) {
      res.status(401).json({ error: "Kullanıcı doğrulanamadı." });
      return;
    }
  
    try {
      const followers = await prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              surname: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
  
      const result = followers.map(f => f.follower);
  
      res.status(200).json(result);
    } catch (err) {
      console.error("Takipçiler alınırken hata:", err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
};

export const isFollowing = async (req: Request, res: Response): Promise<void> => {
    const followerId = req.user?.userId;
    const followingId = req.params.userId;
  
    if (!followerId || !followingId) {
      res.status(400).json({ error: "Eksik bilgi" });
      return;
    }
  
    try {
      const follow = await prisma.follow.findFirst({
        where: {
          followerId,
          followingId,
        },
      });
  
      res.status(200).json({ isFollowing: !!follow });
    } catch (err) {
      console.error("Takip kontrolü hatası:", err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  };
  
export const getSuggestedUsers = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
  
    if (!userId) {
      res.status(401).json({ error: "Kullanıcı doğrulanamadı." });
      return;
    }
  
    try {
      const followed = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
  
      const followedIds = followed.map(f => f.followingId);
      followedIds.push(userId); // kendini de hariç tut
  
      // Önerilecek aday sayısını bul
      const totalCount = await prisma.user.count({
        where: { id: { notIn: followedIds } },
      });
  
      const randomSkip = Math.floor(Math.random() * Math.max(totalCount - 5, 0)); // rastgele başlangıç
  
      const suggestedUsers = await prisma.user.findMany({
        where: {
          id: { notIn: followedIds },
        },
        select: {
          id: true,
          name: true,
          surname: true,
          avatar: true,
        },
        skip: randomSkip,
        take: 5,
      });
  
      res.status(200).json(suggestedUsers);
    } catch (error) {
      console.error("Önerilen kullanıcılar alınırken hata:", error);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  };
  
  
