require('dotenv').config();
const fs = require("fs");
const path = require("path");

module.exports = {
  development: {
    username: "admin",
    password: "root",
    database: "admin",
    host: "localhost",
    port: "5433",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(path.resolve("config", process.env.DB_SSL_CA)),
      },
    },
  },
};
