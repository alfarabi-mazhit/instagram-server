const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");
const User = require("../../auth/models/User");
const Post = require("./Post");

const PostLike = sequelize.define("PostLike", {
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Post,
      key: "id",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

User.belongsToMany(Post, {
  through: PostLike,
  foreignKey: "userId",
  as: "likedPosts",
});
Post.belongsToMany(User, {
  through: PostLike,
  foreignKey: "postId",
  as: "likedUsers",
});

PostLike.belongsTo(Post, { foreignKey: "postId" });
Post.hasMany(PostLike, { foreignKey: "postId", as: "postLikes" });

module.exports = PostLike;
