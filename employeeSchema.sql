DROP DATABASE IF EXISTS employeeTrackDB;
CREATE DATABASE employeeTrackDB;

USE employeeTrackDB;

CREATE TABLE department (
    id INT AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY(id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ("Sapphire", "Dillon", 1, NULL),
    ("Dainton", "Powell", 2, 1),
    ("Raul", "Lacey", 3, 2),
    ("Yaqub", "Feeney", 3, 2),
    ("Clay", "Cleveland", 4, 2),
    ("Michelle", "Ochoa", 5, 3),
    ("Esmee", "Erickson", 5, 3),
    ("Mehreen", "Travers", 5, 3),
    ("Fleur", "Keeling", 5, 3),
    ("Maverick", "Preston", 6, 1);


INSERT INTO role (title, salary, department_id) VALUES 
    ("Owner", "275000", 1),
    ("Head Manager", "100000", 1),
    ("Assistant Manager", "80000", 1),
    ("Keyholder", "65000", 2),
    ("Sales Associate", "55000", 2),
    ("Security", "40000", 2);

INSERT INTO department (name) VALUES
    ("Management"),
    ("Retail");