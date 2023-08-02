const { Sequelize } = require("sequelize");
const config = require("./config");
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    port: config.development.port,
    dialect: config.development.dialect,
  }
);
sequelize
  .authenticate()
  .then(() => {
    console.log("CONNECTION TO THE DATABASE HAS BEEN ESTABLISHED SUCCESFULLY.");
  })
  .catch((error) => {
    console.error("UNABLE TO CONNECT TO THE DATABASE:", error);
  });

module.exports = sequelize;
