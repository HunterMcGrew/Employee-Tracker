// required node modules
// const sequelize = require("./config/connection");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
require("dotenv").config();

// // import models
// const Department = require("./models/Department");
// const Role = require("./models/Role");
// const Employee = require("./models/Employee");
// not suppose to use sequelize...suppose to just use mysql2.

// connect to DB and start server

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect(err => {
    if (err) throw err;
    console.log("Connection Established...");
});

afterConnection = () => {

    console.log("---------------------------------------");
    console.log("|                                     |");
    console.log("|               Employee              |");
    console.log("|               Management            |");
    console.log("|                System               |");
    console.log("|                                     |");
    console.log("---------------------------------------");

    // call first function here
    userPrompt();
};

const userPrompt = () => {

    inquirer.prompt ([
        {
            type: "list",
            name: "choices",
            message: "What would you like to do?",
            choices: ["View All Employees",
                      "View All Departments",
                      "View All Roles",
                      "Add an Employee",
                      "Add a Department",
                      "Add a Role",
                      "Update Employee Role",
                      "Quit"]
        }
    ])
    .then((answers) => {
        // all choices into answers array
        const { choices } = answers;

        if (choices === "View All Employees") {
            viewEmployees();
        };

        if (choices === "View All Departments") {
            viewDepartments();
        };

        if (choices === "View All Roles") {
            viewRoles();
        };

        if (choices === "Add an Employee") {
            // function here
        };

        if (choices === "Add a Department") {
            // function here
        };

        if (choices === "Add a Role") {
            // function here
        };

        if (choices === "Update Employee Role") {
            // function here
        };

        if (choices === "Quit") {
            connection.end();
        };

    });
};

// view ALL employees
const viewEmployees = () => {

    const sql = `SELECT employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        department.name AS department,
        role.salary,
        CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee,
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id
        `;

        connection.promise().query(sql, (err, rows) => {
            if (err) throw err;
            console.table(rows);

            userPrompt();
        });
};

// view ALL departments
const viewDepartments = () => {

    const sql = `SELECT department.id AS id, 
        department.name AS department FROM department`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        
        userPrompt();
    });
};

// view ALL roles
const viewRoles = () => {

    const sql = `SELECT row.id AS id,
        row.title AS role, 
        row.salary AS salary,
        department.name as department FROM role
        INNER JOIN department ON role.department_id = department.id`;

        connection.promise().query(sql, (err, rows) => {
            if (err) throw err;
            console.table(rows);

            userPrompt();
        });
};

// Add Employee
const addEmployee = () => {

    return inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName",
            validate: (answer) => {
                if (answer.length < 1) {
                    return console.log("Please enter a valid first name...\n");
                }
                return true;
            }
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName",
            validate: (answer) => {
                if (answer.length < 1) {
                    return console.log("Please enter a valid last name...\n");
                }
                return true;
            }
        },
        {
            type: "input",
            message: "What is this employee's role?",
            name: "employeeRole",
            validate: (answer) => {
                if (answer.length < 1) {
                    return console.log("Please enter a valid role/job title...\n");
                }
                return true;
            }
        },
        {
            type: "input",
            message: "Who is this employee's manager?",
            name: "employeeManager",
            validate: (answer) => {
                if (answer.length < 1) {
                    return console.log("Please enter a valid manager name...\n");
                }
                return true;
            }
        }
    ]);

};

// Add Department
const addDepartment = () => {

    return inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "department",
            validate: (answer) => {
                if (answer.lenght < 1) {
                    return console.log("\nPlease enter a valid department name...\n");
                };
                console.log(`Added ${this.department} to the database`)
                return true;
            }
        },
    ])
    
};



