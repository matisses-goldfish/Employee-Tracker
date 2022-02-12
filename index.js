// format based on Nicloe Wallace: https://github.com/nicolewallace09/employee-tracker
const mysql = require('mysql2')
const inquirer = require('inquirer'); 
const cTable = require('console.table'); 

require('dotenv').config()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'employee_db'
  });
  
  connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    afterConnection();
  });

  const initalQuest = () => {
    inquirer.prompt ([
    {
        type: 'list',
        message: 'What would you like to do?', 
        choices: ['View All Employees', 'Add Employees', 'Update Employee Role', 'View All Roles', 'Add Role', 'View all Departments', 'Add Department', 'Quit']
    },
])
.then((answers) => {
    const { choices } = answers; 

    if (choices === "View All Employees") {
        viewEmployees();
      }
    
    if (choices === "Add Employees") {
        addEmployee();
    }

    if (choices === "Update Employee Role") {
        updateEmployee();
    }

    if (choices === "View All Roles") {
        viewRoles();
    }

    if (choices === "Add Role") {
        addRoles();
    }
    if (choices === "View all Departments") {
        viewDepartment();
    }
    if (choices === "Add Department") {
        addDepartment();
    }

    if (choices === "quit") {
        connection.end()
    };
});
};

viewEmployees = () => {
    console.log('displaying all current employees...\n');
    const sql = `SELECT employee.id AS id, employee.first_name AS employee, employee.last_name AS role, employee.MANAGER_ID AS manager FROM employee`; 
  
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
    });
  };

// View all Employees:
// I need a function that would allow mysql to read this txt within our command line 
// SELECT * FROM Employee;


addEmployee = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'empFistName',
        message: "What is the employee's first name?",
        validate: empFirstName => {
          if (empFirstName) {
              return true;
          } else {
              console.log('Please enter their first name');
              return false;
          }
        }
      },
      {
        type: 'input',
        name: 'empLastName',
        message: "What is the employee's last name?",
        validate: empLastName => {
          if (empLastName) {
              return true;
          } else {
              console.log('Please enter a last name');
              return false;
          }
        }
      }
    ])
      .then(answer => {
      const params = [answer.empFirstName, answer.empLastName]
  
      // grab roles from roles table
      const roleSql = `SELECT role.id, role.title FROM role`;
    
      connection.promise().query(roleSql, (err, data) => {
        if (err) throw err; 
        
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
  
        inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
              }
            ])
              .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);
  
                const managerSql = `SELECT * FROM employee`;
  
                connection.promise().query(managerSql, (err, data) => {
                  if (err) throw err;
  
                  const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
                  // console.log(managers);
  
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager);
  
                      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;
  
                      connection.query(sql, params, (err, result) => {
                      if (err) throw err;
                      console.log(`Added ${data.empFirstName} ${dataempLastName} to the database`)
  
                      viewEmployees();
                });
              });
            });
          });
       });
    });
  };

  updateEmployee = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;
  
    connection.promise().query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'empName',
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.empName;
          const params = []; 
          params.push(employee);
  
          const roleSql = `SELECT * FROM role`;
  
          connection.promise().query(roleSql, (err, data) => {
            if (err) throw err; 
  
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's new role?",
                  choices: roles
                }
              ])
                  .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role); 
                  
                  let employee = params[0]
                  params[0] = role
                  params[1] = employee 
                  
  
                  // console.log(params)
  
                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
                  connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                  console.log(`Success! ${Data.empName} is now a ${Data.role}`);
                
                  viewEmployees();
            });
          });
        });
      });
    });
  };

  viewRoles = () => {
    console.log('displaying all current roles...\n');
    const sql = `SELECT roles.id AS id, roles.title AS title, roles.salary AS salary, employee.department AS department FROM roles`; 
  
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
    });
  };


  addRole = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'newRole',
        message: "What is the name of the Role",
        validate: newRole => {
          if (newRole) {
              return true;
          } else {
              console.log('Please provide a valid role');
              return false;
          }
        }
      },
      {
        type: 'input',
        name: 'newSalary',
        message: "What is the Salary of the role?",
        validate: isNumeric => {
          if (isNumeric) {
              return true;
          } else {
              console.log('Please Provide a valid Salary');
              return false;
          }
        }
      }
    ])
      .then(answer => {
      const params = [answer.newRole, answer.newSalary]
  
      // grab roles from roles table
      const departmentSql = `SELECT department.id, department.title FROM department`;
    
      connection.promise().query(departmentSql, (err, data) => {
        if (err) throw err; 
        
        const department = data.map(({ id, title }) => ({ name: title, value: id }));
  
        inquirer.prompt([
              {
                type: 'list',
                name: 'department',
                message: "which department does this role belong to?",
                choices: department
              }
            ])
              .then(departmentChoice => {
                const department = departmentChoice.department;
                params.push(department);
                const sql = `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`;

                connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log(`Success! ${data.newRole} has now been added to the database!`); 

            viewRoles();
       });
     });
   });
 });
};

viewDepartment = () => {
    console.log('Displaying all current departments...\n');
    const sql = `SELECT department.id AS id, department.title AS department FROM department`; 
  
    connection.promise().query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
    });
  };


addDepartment = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'newDepartment',
        message: "What department do you want to add?",
        validate: newDepartment => {
          if (newDepartment) {
              return true;
          } else {
              console.log('Please provide a vaild department title');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        connection.query(sql, answer.newDepartment, (err, result) => {
          if (err) throw err;
          console.log(`Sucess! ${data.newDepartment} has now been added to the database!`); 
  
          viewDepartment();
      });
    });
  };
