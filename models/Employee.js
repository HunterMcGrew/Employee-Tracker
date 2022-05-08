const { Model, DataTypes } = require("sequelize");
const sequelize = require("./config/connection.js");

class Employee extends Model {}

Employee.init(
    {
        id: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    {
        first_name: DataTypes.STRING,
        allowNull: false,
    },
    {
        last_name: DataTypes.STRING,
        allowNull: false,
    },
    {
        title: {  // grab title, salary, and department from roles table 
            type: DataTypes.STRING,
            references: {
                model: "role",
                key: "id",
            },
        },
    },
    {
        salary: {
            type: DataTypes.INTEGER,
            references: {
                model: "role",
                key: "id",
            },
        },
    },
    {
        department: {
            type: DataTypes.STRING,
            references: {
                model: "role",
                key: "id",
            },
        },
    },
    {
        employee_manager: DataTypes.STRING,
        allowNull: true,
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: "employee_data",
    }
);


module.exports = Employee;