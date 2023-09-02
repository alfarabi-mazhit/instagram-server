const { Sequelize } = require("sequelize");
const config = require("./config");
let sequelize;
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(
    config.production.database,
    config.production.username,
    config.production.password,
    {
      host: config.production.host,
      port: config.production.port,
      dialect: config.production.dialect,
      dialectOptions: config.production.dialectOptions,
    }
  );
} else {
  sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
      host: config.development.host,
      port: config.development.port,
      dialect: config.development.dialect,
    }
  );
}

sequelize
  .authenticate()
  .then(() => {
    console.log("CONNECTION TO THE DATABASE HAS BEEN ESTABLISHED SUCCESFULLY.");
  })
  .catch((error) => {
    console.error("UNABLE TO CONNECT TO THE DATABASE:", error);
  });

module.exports = sequelize;
