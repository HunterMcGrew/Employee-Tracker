const sequelize = require("./config/connection.js");
const { Model, DataTypes } = require("sequelize");

class Role extends Model {}

Role.init(
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
        department: DataTypes.STRING,
        allowNull: false,
    },
    {
        salary: DataTypes.INTEGER,
        allowNull: false,
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: "role"
    }
);

module.exports = Role;