const mysql = require('mysql')
const inquirer = require('inquirer')
const cTable = require('console.table')

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
    connection.query('SELECT * FROM employees', (err, res) => {
        if(err) throw err
            res.forEach((employees) => {
            
            const table = cTable.getTable([
                {
                    // id: res.forEach((employees) => {`${employees.id}`}),
                    first_name: `${employees.first_name}`,
                    last_name: `${employees.last_name}`,
                    // title: `${role.title}`,                   
                    // department: `${employees.id}`, //comes from department.name
                    // salary: `${employees.id}`, //comes from role.salary
                    // manager: `${employees.id}` //comes from employee.manager_id.first_name,last_name??
                }
            ])
            console.log(table)
        })
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