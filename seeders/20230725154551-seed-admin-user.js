const bcrypt = require("bcrypt");
const Role = require("../app/auth/models/Role");
const User = require("../app/auth/models/User");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminRole = await Role.findOne({ where: { name: "admin" } });
    const myPassword = "ALFARABI";
    await User.bulkCreate([
      {
        username: "instagram",
        email: null,
        password: bcrypt.hashSync(myPassword, 10),
        name: "Instagram",
        roleId: adminRole.id,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await User.destroy({ where: { username: "instagram" } });
  },
};
