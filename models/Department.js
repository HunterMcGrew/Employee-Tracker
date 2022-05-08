const sequelize = require("./config/connection.js");
const { Model, DataTypes } = require("sequelize");

class Department extends Model {}

Department.init(
    {
        id: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    {
        title: DataTypes.STRING,
        allowNull: false,
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: "department",
    },
);

module.exports = Department;