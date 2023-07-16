const dotenv = require("dotenv").config();

const Sequelize = require("sequelize");

let sequelize = {};
try {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "postgres",
      freezeTableName: true,
      pool: {
        max: 5,
        min: 0,
        acquire: 30 * 1000,
        idle: 10000,
      },
      dialectOptions: {
        decimalNumbers: true,
        charset: "utf8mb4",
      },
      logging: true,
    }
  );

  sequelize.authenticate();
} catch (err) {
  console.log(err);
}

module.exports = sequelize;
