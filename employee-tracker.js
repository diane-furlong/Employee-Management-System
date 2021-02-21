const mysql = require('mysql')
const inquirer = require('inquirer')
const cTable = require('console.table')
const Employee = require('./employees.js')

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Lysqm098*',
  database: 'employee_tracker_db',
})

const promptUser = () =>
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'Exit'],
            name: 'initialPrompt'
        }
    ])
    .then (function (answer){
        switch(answer.initialPrompt){
            case 'View All Employees':
                viewAll()
                break
            case 'View All Employees By Department':
                viewByDept()
                break
            // case 'View All Employees By Manager':
            //     viewByMgr()
            //     break
            // case 'Add Employee':
            //     addEmployee()
            //     break
            // case 'Remove Employee':
            //     removeEmployee()
            //     break
            // case 'Update Employee Role':
            //     updateEmployeeRole()
            //     break
            case 'Exit':
                connection.end()
                break
        }
    })

const viewAll = () => {
    const query = 'SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, " ", m.last_name) AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id LEFT OUTER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id'
    connection.query(query, (err, res) => {
        if (err) throw err
          console.table(res)
          promptUser()
    })
}

const viewByDept = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What department would you like to view?',
            choices: ['construction', 'marketing'],
            name: 'chooseDept'
        }
    ])
    .then (answer => {
        const query = 'SELECT employees.id, employees.first_name, employees.last_name, role.title, department.name FROM employees LEFT OUTER JOIN role ON employees.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE ?'
        connection.query(query,
        {name: answer.chooseDept},
        (err, res) => {
            if (err) throw err
            console.table(res)
        })
    })
}

// const viewByMgr = () =>{}

// const addEmployee = () => {}

// const removeEmployee = () => {}

// const updateEmployeeRole = () => {}

connection.connect((err) => {
    if (err) throw err
    promptUser()
})