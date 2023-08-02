const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  createComment,
  deleteCommentById,
  commentLike,
  getCommentsByPostId,
} = require("./controllers");
const { validateComment, isAuthorOfCommentOrPost } = require("./middlewares");

router.post(
  "/api/comment",
  passport.authenticate("jwt", { session: false }),
  validateComment,
  createComment
);

// router.get(
//   "/api/myComments",
//   passport.authenticate("jwt", { session: false }),
//   getMyComments
// );

router.get(
  "/api/comments/:postId",
  passport.authenticate("jwt", { session: false }),
  getCommentsByPostId
);

// router.get(
//   "/api/comment/:id",
//   passport.authenticate("jwt", { session: false }),
//   getCommentById
// );

router.delete(
  "/api/comment/:id",
  passport.authenticate("jwt", { session: false }),
  isAuthorOfCommentOrPost,
  deleteCommentById
);

router.post(
  "/api/comment/:id/like",
  passport.authenticate("jwt", { session: false }),
  commentLike
);

module.exports = router;
