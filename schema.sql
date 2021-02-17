DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

SELECT * FROM department;

CREATE TABLE role (
    id INT AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT FOREIGN KEY REFERENCES department(id),
    PRIMARY KEY (id)
);

SELECT * FROM role;

CREATE TABLE employees (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT FOREIGN KEY REFERENCES role(id),
    manager_id INT NULL FOREIGN KEY REFERENCES employees(id),
    PRIMARY KEY (id)
);

SELECT * FROM employees;

