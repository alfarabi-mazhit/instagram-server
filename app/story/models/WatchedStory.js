const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");
const User = require("../../auth/models/User");
const Story = require("./Story");

const WatchedStory = sequelize.define("WatchedStory", {
  storyId: {
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
User.belongsToMany(Story, {
  through: WatchedStory,
  foreignKey: "postId",
  as: "WatchedStories",
});
Story.belongsToMany(User, {
  through: WatchedStory,
  foreignKey: "userId",
  as: "WatchedUsers",
});
module.exports = WatchedStory;
