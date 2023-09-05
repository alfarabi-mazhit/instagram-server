const Post = require("../post/models/Post");
const Comment = require("./models/Comment");
const CommentLike = require("./models/CommentLike");

const createComment = async (req, res) => {
  const comment = await Comment.create({
    postId: req.body.postId,
    userId: req.user.id,
    taggedUserId: req.body.taggedUserId || null,
    refId: req.body.refId || null,
    text: req.body.text,
  });
  res.status(200).send(comment);
};
const deleteCommentById = async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);
  if (!comment) {
    return res.status(404).send({ message: "Такого комментария не существует" });
  }
  comment.destroy();
  res.status(200).end();
};

const getCommentsByPostId = async (req, res) => {
  const post = await Post.findByPk(req.params.postId);
  if (!post) {
    return res.status(404).send({ message: "Такого поста не найдено" });
  }
  const comments = await Comment.findAll({ where: { postId: post.id } });
  res.status(200).send(comments);
};

const commentLike = async (req, res) => {
  const comment = await Comment.findByPk(req.params.id);
  if (!comment) {
    return res.status(400).send({ message: "Comment not found" });
  }
  const [like, created] = await CommentLike.findOrCreate({
    where: {
      commentId: comment.id,
      userId: req.user.id,
    },
  });
  if (created) {
    return res.status(200).send({ message: "Like added" });
  } else {
    await like.destroy();
    return res.status(200).send({ message: "Like removed" });
  }
};
module.exports = {
  createComment,
  deleteCommentById,
  commentLike,
  getCommentsByPostId,
};
