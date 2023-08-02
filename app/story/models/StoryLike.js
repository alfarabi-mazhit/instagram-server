const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");
const User = require("../../auth/models/User");
const Story = require("./Story");

const StoryLike = sequelize.define("StoryLike", {
  storyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Story,
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
  through: StoryLike,
  foreignKey: "userId",
  as: "likedStories",
});
Story.belongsToMany(User, {
  through: StoryLike,
  foreignKey: "storyId",
  as: "likedUsers",
});

module.exports = StoryLike;
