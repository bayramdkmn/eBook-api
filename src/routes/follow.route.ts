import express from "express";
import { followUser, getDiscoverFollow, getFollowers, getFollowing, isFollowing, unfollowUser } from "../controllers/follow.controller";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = express.Router();

router.get("/", authenticateToken, getDiscoverFollow);
router.post("/", authenticateToken, followUser);
router.delete("/:userId", authenticateToken, unfollowUser);
router.get("/following", authenticateToken, getFollowing);
router.get("/followers", authenticateToken, getFollowers);
router.get("/is-following/:userId", authenticateToken, isFollowing);

export default router;
