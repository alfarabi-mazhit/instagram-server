const Post = require("./models/Post");

const validatePost = (req, res, next) => {
  let errors = {};
  if (!req.file) {
    errors.media = "Поле Медиа обязательное";
  }
  if (JSON.stringify(errors) !== JSON.stringify({})) res.status(400).send(errors);
  else next();
};

const isAuthorOfPost = async (req, res, next) => {
  const id = req.params.id || req.body.id;
  const post = await Post.findByPk(id);
  if (!post) res.status(400).send({ message: "Post with that id does not exist" });
  else if (req.user.id === post.userId) next();
  else res.status(403).send({ message: "Access Forbidden" });
};

module.exports = { validatePost, isAuthorOfPost };
