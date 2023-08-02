const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");
const User = require("../../auth/models/User");
const Comment = require("./Comment");

const CommentLike = sequelize.define("CommentLike", {
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Comment,
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

User.belongsToMany(Comment, {
  through: CommentLike,
  foreignKey: "userId",
  as: "likedComments",
});
Comment.belongsToMany(User, {
  through: CommentLike,
  foreignKey: "commentId",
  as: "likingUsers",
});

module.exports = CommentLike;
