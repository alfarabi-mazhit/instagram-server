const Role = require("../app/auth/models/Role");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Role.bulkCreate([{ name: "user" }, { name: "moderator" }, { name: "admin" }]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Roles", null, {});  
  },
};
