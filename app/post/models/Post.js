const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");
const User = require("../../auth/models/User");

const Post = sequelize.define("Post", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Post.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Post,{foreignKey: "userId", as: "createdPosts"})
module.exports = Post;
