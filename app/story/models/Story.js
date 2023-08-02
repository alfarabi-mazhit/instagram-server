const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db");
const User = require("../../auth/models/User");

const Story = sequelize.define(
  "Story",
  {
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
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Stories", 
  }
);

Story.belongsTo(User, { foreignKey: "userId" });

module.exports = Story;
