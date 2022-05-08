const sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    //DB name
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        dialect: "mysql",
    });

module.exports = sequelize; 