const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");
const User = require("../../auth/models/User");
const Post = require("./Post");

const SavedPost = sequelize.define("SavedPost", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Post,
      key: "id",
    },
  },
});
User.belongsToMany(Post, {
  through: SavedPost,
  foreignKey: "postId",
  as: "savedPosts",
});
Post.belongsToMany(User, {
  through: SavedPost,
  foreignKey: "userId",
});
module.exports = SavedPost;
