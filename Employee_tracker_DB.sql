DROP DATABASE IF EXISTS employee_tracker_DB;

CREATE DATABASE employee_tracker_DB;

USE employee_tracker_DB;



CREATE TABLE department (
    id INTEGER AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE role (
    id INTEGER AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(20,2) NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    PRIMARY KEY (id)
);

