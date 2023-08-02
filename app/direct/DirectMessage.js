// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/db");
// const User = require("../auth/models/User");

// const DirectMessage = sequelize.define("DirectMessage", {
//   receiverUserId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: User,
//       key: "id",
//     },
//   },
//   senderUserId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: User,
//       key: "id",
//     },
//   },
//   text: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
// });

// DirectMessage.belongsTo(User, { foreignKey: "receiverUserId" });
// DirectMessage.belongsTo(User, { foreignKey: "senderUserId" });
// User.hasMany(DirectMessage, {
//   foreignKey: "receiverUserId",
//   as: "receivingUsers",
// });
// User.hasMany(DirectMessage, {
//   foreignKey: "senderUserId",
//   as: "sendingUsers",
// });

// module.exports = DirectMessage;
