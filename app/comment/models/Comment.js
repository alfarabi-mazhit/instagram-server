const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");
const User = require("../../auth/models/User");
const Post = require("../../post/models/Post");

const Comment = sequelize.define("Comment", {
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
  taggedUserId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Comment, { foreignKey: "userId", as: "userComments" });

Comment.belongsTo(User, { foreignKey: "taggedUserId", as: "taggedUser" });
User.hasMany(Comment, { foreignKey: "taggedUserId", as: "taggedBy" });

Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });
Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });

Comment.hasMany(Comment, { foreignKey: "refId", as: "childComments" });
Comment.belongsTo(Comment, { foreignKey: "refId", as: "parentComment" });

module.exports = Comment;
