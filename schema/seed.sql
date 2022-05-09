INSERT INTO department (name)
VALUES 
("Sales"),
("Marketing"),
("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES 
("Accountant", 80000, 1),
("Sales Rep", 60000, 1),
("Accounting Manager", 110000, 1),
("Head of Marketing", 100000, 2),
("Marketing Assistant", 75000, 2),
("Project Manager", 100000, 3),
("Software Engineer", 95000, 3),
("Engineering Manager", 125000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("John", "Smith", 1, 3),
("Jane", "Doe", 2, 3),
("John", "Doe", 3, 0),
("Keaton", "Johnson", 4, 0),
("Ashton", "Anderson", 5, 4),
("Daffy", "Duck", 6, 0),
("Mikey", "Mouse", 7, 8),
("Kayle", "Monroe", 8, 0);