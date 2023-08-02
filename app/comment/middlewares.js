const User = require("../auth/models/User");
const Post = require("../post/models/Post");
const Comment = require("./models/Comment");

const validateComment = async (req, res, next) => {
  let errors = {};
  if (!req.body.postId || req.body.postId.length === 0) {
    errors.postId = "Поле postId обязательное";
  } else {
    const post = await Post.findByPk(req.body.postId);
    if (!post) {
      errors.post = "Такого поста не существует";
    }
  }
  if (!req.body.text || req.body.text.length === 0) {
    errors.text = "Поле text обязательное";
  }
  if (req.body.refId && !(req.body.refId.length === 0)) {
    const comment = await Comment.findByPk(req.body.refId);
    if (!comment) {
      errors.refComment = "Такого refComment комментария не существует";
    }
  }
  if (req.body.taggedUserId && !(req.body.taggedUserId.length === 0)) {
    const user = await User.findByPk(req.body.taggedUserId);
    if (!user) {
      errors.taggedUser = "Такого taggedUser не существует";
    }
    // if (user.id === req.user.id) {
    //   errors.taggedUser = "Нельзя отметить самого себя";
    // }
  }
  if (JSON.stringify(errors) !== JSON.stringify({})) res.status(400).send(errors);
  else next();
};

const isAuthorOfCommentOrPost = async (req, res, next) => {
  const comment = await Comment.findByPk(req.params.id);
  const post = await Post.findByPk(req.body.postId);
  const errors = {};
  if (!comment) {
    errors.comment = "Comment not found";
  }
  if (!post) {
    errors.post = "Post not found";
  }
  if (
    comment &&
    req.user.id !== comment.userId &&
    post &&
    req.user.id !== post.userId
  ) {
    errors.access = "Access denied";
  }
  if (JSON.stringify(errors) !== JSON.stringify({}))
    return res.status(400).send(errors);
  else {
    next();
  }
};
module.exports = { validateComment, isAuthorOfCommentOrPost };
