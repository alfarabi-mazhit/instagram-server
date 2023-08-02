const Post = require("./models/Post");
const fs = require("fs");
const path = require("path");
const PostLike = require("./models/PostLike");
const Comment = require("../comment/models/Comment");
const User = require("../auth/models/User");

const createPost = async (req, res) => {
  try {
    const post = await Post.create({
      userId: req.user.id,
      mediaUrl: "/users/" + req.user.id + "/posts/" + req.file.filename,
      description: req.body.description ? req.body.description : null,
      location: req.body.location ? req.body.location : null,
    });
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

const getMyPosts = async (req, res) => {
  const myPosts = await Post.findAll({ where: { userId: req.user.id } });
  res.status(200).send(myPosts);
};

const getAllPosts = async (req, res) => {
  const allPosts = await Post.findAll();
  res.status(200).send(allPosts);
};

const getPostById = async (req, res) => {
  const post = await Post.findByPk(req.params.id, {
    include: [
      // { model: User, as: "likedUsers" },
      { model: PostLike, as: "postLikes" },
      { model: Comment, as: "comments" },
    ],
  });
  res.status(200).send(post);
};

const getPostsByUsername = async (req, res) => {
  const user = await User.findOne({
    where: { username: req.params.username },
  });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  const posts = await Post.findAll({
    where: { userId: user.id },
    include: [
      // { model: User, as: "likedUsers" },
      { model: PostLike, as: "postLikes" },
      { model: Comment, as: "comments" },
    ],
  });
  res.status(200).send(posts);
};

const deletePostById = async (req, res) => {
  const post = await Post.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!post) {
    return res.status(404).send({ message: "Post not found" });
  }
  const filePath = path.join(__dirname, "..", "..", "..", "public", post.mediaUrl);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  await post.destroy();
  res.status(200).end();
};

const editPostById = async (req, res) => {
  const updateFields = {};
  if (req.file) {
    updateFields.mediaUrl = "/users/" + req.user.id + "/posts/" + req.file.filename;
  }
  if (req.body.description) {
    updateFields.description = req.body.description;
  }
  if (req.body.location) {
    updateFields.location = req.body.location;
  }

  await Post.update(updateFields, {
    where: {
      id: req.params.id,
    },
  });
  res.status(200).end();
};

const postLike = async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) {
    return res.status(400).send({ message: "Post not found" });
  }
  const [like, created] = await PostLike.findOrCreate({
    where: {
      postId: post.id,
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
  createPost,
  getMyPosts,
  getAllPosts,
  getPostById,
  deletePostById,
  editPostById,
  postLike,
  getPostsByUsername,
};
