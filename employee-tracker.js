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
            // case 'View All Employees By Department':
            //     viewByDept()
            //     break
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
        if(err) throw err
       
        // cTable.getTable(res.forEach((employees,role) => {
        //     const table = [
        //         {
        //             id: `${employees.id}`,
        //             first_name: `${employees.first_name}`,
        //             last_name: `${employees.last_name}`,
        //             title: `${role.title}`,                   
        //             // department: `${employees.id}`, //comes from department.name
        //             // salary: `${employees.id}`, //comes from role.salary
        //             // manager: `${employees.id}` //comes from employee.manager_id.first_name,last_name??
        //         }
        //     ]
          console.table(res)
        // }))
    })
    // promptUser()
}

// const viewByDept = () =>{
    
// }

// const viewByMgr = () =>{}

// const addEmployee = () => {}

// const removeEmployee = () => {}

// const updateEmployeeRole = () => {}

connection.connect((err) => {
    if (err) throw err
    promptUser()
})