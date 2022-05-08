const Employee = require("./Employee");
const Role = require("./Role");
const Department = require("./Department");

Role.belongsTo(Department, {
    foreignKey: "department_id",
});

Department.hasMany(Role, {
    foreignKey: "role_id",
});

Employee.belongsTo(Role, {
    foreignKey: "role_id",
});


module.exports = { Employee, Role, Department };

// not suppose to use sequelize...suppose to just use mysql2.