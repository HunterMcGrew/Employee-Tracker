// required node modules
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
require("dotenv").config();

// connect to DB and start server

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
// if connection error, throw error, otherwise...
connection.connect(err => {
    if (err) throw err;
    console.log("Connection Established...");
    onConnection();
});

onConnection = () => {

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
            addEmployee();
        };

        if (choices === "Add a Department") {
            addDepartment();
        };

        if (choices === "Add a Role") {
            addRole();
        };

        if (choices === "Update Employee Role") {
            updateEmployeeRole();
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
        CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id
        `;

        connection.query(sql, (err, rows) => {
            if (err) throw err;
            console.table(rows);

            userPrompt();
        });
};

// view ALL departments
const viewDepartments = () => {

    const sql = `SELECT department.id AS id, 
        department.name AS department FROM department`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        
        userPrompt();
    });
};

// view ALL roles
const viewRoles = () => {

    const sql = `SELECT role.id,
        role.title, 
        role.salary,
        department.name as department FROM role
        INNER JOIN department ON role.department_id = department.id`;

        connection.query(sql, (err, rows) => {
            if (err) throw err;
            console.table(rows);

            userPrompt();
        });
};

// Add Employee
const addEmployee = () => {

    const empSql = `SELECT * FROM employee`;

    connection.query(empSql, (err, empRes) => {
        if (err) throw err;
        // obj for manager selection
        const managerSelect = [
            {
                name: "None",
                value: 0
            }
        ];
        // push all employee's into manager obj
        empRes.forEach( ({ first_name, last_name, id }) => {
            managerSelect.push({
                name: first_name + " " + last_name,
                value: id
            });
        });

        const roleSql = `SELECT * FROM role`;
        connection.query(roleSql, (err, roleRes) => {
            if (err) throw err;
            // all roles 
            const availRoles = [];
            // push all roles into availRoles obj
            roleRes.forEach( ({ title, id }) => {
                availRoles.push(
                    {
                        name: title,
                        value: id
                    }
                );
            });

            inquirer.prompt([
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
                    type: "list",
                    message: "What is this employee's role?",
                    name: "role_id",
                    choices: availRoles
                },
                {
                    type: "list",
                    message: "Who is this employee's manager?",
                    name: "manager_id",
                    choices: managerSelect,
                },
            ])
            .then(answers => {
                const sql = `INSERT INTO employee (
                    first_name,
                    last_name,
                    role_id,
                    manager_id) VALUES (?, ?, ?, ?)`;
                
                connection.query(sql, [answers.firstName, answers.lastName, answers.role_id, answers.manager_id], (err, res) => {
                    if (err) throw err;
                    console.log("Successfully added new employee!");

                    userPrompt();
                });
            })
            .catch(err => {
                console.log(err);
            });

        });

    });
};

// Add Department
const addDepartment = () => {

    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "department",
            validate: (answer) => {
                if (answer.lenght < 1) {
                    return console.log("\nPlease enter a valid department name...\n");
                };
                console.log(`\nAdded ${answer} to the database`)
                return true;
            }
        },
    ])
    .then( answer => {
        const sql = `INSERT INTO department (name) VALUES (?)`;

        connection.query(sql, answer.department, (err, result) => {
            if (err) throw err;
            console.log(answer.department + " added successfully to departments.");

             userPrompt();
        });
    });
};

const addRole = () => {

    inquirer.prompt([
        {
            type: "input",
            message: "What role would you like to add?",
            name: "newRole",
            validate: newRole => {
                if (newRole.length < 1) {
                    return console.log("Please add a valid role name.");
                }
                return true;
            }
        },
        {
            type: "input",
            message: "What is this role's salary?",
            name: "newSalary",
            validate: newSalary => {
                if (isNaN(newSalary)) {
                    console.log("\nPlease enter a valid salary number.");
                    return false;
                }  else {
                    return true;
                };
            }
        },
    ])
    .then( answers => {
        // store new role info from above
        const roleInfo = [answers.newRole, answers.newSalary];
        // dept info
        const deptSql = `SELECT name, id FROM department`;

        connection.query(deptSql, (err, data) => {
            if (err) throw err;

            const departments = data.map( ({ id, name }) => ({ name: name, value: id }));

            inquirer.prompt([
                {
                    type: "list",
                    message: "What department does this role belong to?",
                    name: "roleDept",
                    choices: departments
                },
            ])
            .then( answer => {
                const dept = answer.roleDept;
                roleInfo.push(dept);

                const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

                connection.query(sql, roleInfo, (err, res) => {
                    if (err) throw err;
                    console.log("Successfully added new role.");
                    
                    userPrompt();
                });
            });
        });

    })
    .catch(err => {
        console.log(err);
    });
};

const updateEmployeeRole = () => {

    const empSql = `SELECT first_name, last_name, id FROM employee`;

    connection.query(empSql, (err, empRes) => {
        if (err) throw err;
        // available employees
        const employees = [];
        // grab data, push it into employees
        empRes.forEach( ({ first_name, last_name, id }) => {
            employees.push({
                name: first_name + " " + last_name,
                value: id
            });
        });
        console.log(employees);

        const roleSql = `SELECT * FROM role`;

        connection.query(roleSql, (err, roleRes) => {
            if (err) throw err;
            // all roles
            const roles = [];
            // push all roles into roles
            roleRes.forEach( ({ title, id }) => {
                roles.push(
                    {
                        name: title,
                        value: id
                    }
                );
            });

            inquirer.prompt([
                {
                    type: "list",
                    message: "Which employee's role would you like to change?",
                    name: "id",
                    choices: employees
                },
                {
                    type: "list",
                    message: "What is this employee's new role?",
                    name: "role_id",
                    choices: roles
                },
            ])
            .then( answers => { // need to tell it which employee
                console.log("answers:", answers);                
                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                connection.query(sql, [answers.role_id, answers.id], (err, res) => {
                    if (err) throw err;
                    console.log("Employee's role updated successfully.");

                    userPrompt();
                });
            })
            .catch( err => {
                console.log(err);
            })
        });
    });
};