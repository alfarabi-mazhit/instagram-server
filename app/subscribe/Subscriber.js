const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const User = require("../auth/models/User");

const Subscriber = sequelize.define("Subscriber", {
  targetUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  subUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

Subscriber.belongsTo(User, { foreignKey: "targetUserId" });
Subscriber.belongsTo(User, { foreignKey: "subUserId" });
User.hasMany(Subscriber, { foreignKey: "targetUserId", as: "targetUsers" });
User.hasMany(Subscriber, { foreignKey: "subUserId", as: "subUsers" });

module.exports = Subscriber;
