const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  createPost,
  getMyPosts,
  getAllPosts,
  getPostById,
  deletePostById,
  editPostById,
  postLike,
  getPostsByUsername,
} = require("./controllers");
const { validatePost, isAuthorOfPost } = require("./middlewares");
const { upload } = require("./utils");
router.post(
  "/api/post",
  passport.authenticate("jwt", { session: false }),
  upload.single("media"),
  validatePost,
  createPost
);
router.get(
  "/api/myPosts",
  passport.authenticate("jwt", { session: false }),
  getMyPosts
);
router.get(
  "/api/allPosts",
  passport.authenticate("jwt", { session: false }),
  getAllPosts
);
router.get(
  "/api/post/:id",
  // passport.authenticate("jwt", { session: false }),
  getPostById
);
router.get(
  "/api/posts/byUsername/:username",
  // passport.authenticate("jwt", { session: false }),
  getPostsByUsername
);
router.delete(
  "/api/post/:id",
  passport.authenticate("jwt", { session: false }),
  isAuthorOfPost,
  deletePostById
);
router.put(
  "/api/post/:id",
  passport.authenticate("jwt", { session: false }),
  isAuthorOfPost,
  upload.single("media"),
  editPostById
);
router.post(
  "/api/post/:id/like",
  passport.authenticate("jwt", { session: false }),
  postLike
);
module.exports = router;
