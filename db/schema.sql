DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
);

CREATE TABLE roles (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT NOT NULL,
  INDEX dep_ind (department_id),
  CONSTRAINT fk_department 
  FOREIGN KEY (department_id) 
  REFERENCES department(id) 
  
  ON DELETE SET NULL
);

CREATE TABLE employee (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  roles_id INTEGER, 
  INDEX roles_ind (roles_id),
  CONSTRAINT fk_roles 
  FOREIGN KEY (roles_id) 
  REFERENCES roles(id) 
  ON DELETE SET NULL,
  manager_id INTEGER,
  INDEX manager_ind (manager_id),
  CONSTRAINT fk_manager 
  FOREIGN KEY (manager_id) 
  REFERENCES employee(id)

  ON DELETE SET NULL
);
