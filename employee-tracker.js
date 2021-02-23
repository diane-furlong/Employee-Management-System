const mysql = require('mysql')
const inquirer = require('inquirer')

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.DB_PASS,
  database: 'employee_tracker_db',
})

const promptUser = () =>
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Add New Department', 'Add New Role', 'Exit'],
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
            case 'View All Employees By Manager':
                viewByMgr()
                break
            case 'Add Employee':
                addEmployee()
                break
            case 'Remove Employee':
                removeEmployee()
                break
            case 'Update Employee Role':
                updateEmployeeRole()
                break
            case 'Add New Department':
                addNewDepartment()
                break
            case 'Add New Role':
                addNewRole()
                break
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
    const query = 'SELECT name FROM department'
    connection.query(query,(err,res) => {
        if (err) throw err
        inquirer.prompt([
        {
            type: 'list',
            message: 'What department would you like to view?',
            choices: res,
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
                promptUser()
            })
        })
    })
}

const viewByMgr = () => {
    const query = 'SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, " ", m.last_name) AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id LEFT OUTER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY manager'
    connection.query(query, (err, res) => {
        if (err) throw err
          console.table(res)
          promptUser()
    })
}

const addEmployee = () => {
    const titleArray = []
   
    const query = 'SELECT role.id, role.title FROM role'
    connection.query(query, (err, res) => {
        if (err) throw err
        for(i=0;i<res.length;i++){
            titleArray.push(res[i].title)
        }
        const managerArray = []
        const query2 = 'SELECT e.id, e.first_name, e.last_name, concat(m.first_name, " ", m.last_name) AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id'
        connection.query(query2, (err, res) => {
            if (err) throw err
            for(i=0;i<res.length;i++){
                if(res[i].manager !== null){
                   managerArray.push(res[i].manager) 
                }
            }

            //make option for employee to not have manager
            managerArray.unshift('--')

            inquirer.prompt([
                {
                    type: 'input',
                    message: "What is the new employee's first name?",
                    name: 'newFirstName',
                    validate: function(input){
                        if(input === ""){
                            console.log("First name is required.")
                            return false
                        }
                        else {
                            return true
                        }
                    }
                },
                {
                    type: 'input',
                    message: "What is the new employee's last name?",
                    name: 'newLastName',
                    validate: function(input){
                        if(input === ""){
                            console.log("Last name is required.")
                            return false
                        }
                        else {
                            return true
                        }
                    }
                },
                {
                    type: 'list',
                    message: "What is the new employee's title?",
                    choices: titleArray,
                    name: 'newEmpTitle'
                },
                {
                    type: 'list',
                    message: "Who is the new employee's manager?",
                    choices: managerArray,
                    name: 'newEmpMgr' 
                }
            ])  
            .then ((answer) => {
                const query = 'SELECT role.id, role.title FROM role'
                connection.query(query, (err, role) => {
                    if (err) throw err
                    
                    //set variables for ID
                    let titleID = null
                  
                    //get the role ID of the new employee's title
                    for(i=0;i<role.length;i++){
                        if (answer.newEmpTitle == role[i].title){
                            titleID = role[i].id
                        }
                    }  
                    
                    const query2 = 'SELECT e.id, e.first_name, e.last_name, concat(m.first_name, " ", m.last_name) AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id'
                    connection.query(query2, (err, manager) => {
                        if (err) throw err
                      
                        //set variable for ID
                        let managerID = null
                        let managerName = null
                        let managerNameArray = null
                        
                        //look in the database for the manager's name. match the name with the manager's employee.id
                        //if answer.newEmpMgr == manager, managerID = manager.id
                        for (i=0;i<1;i++){
                            if (manager[i] = answer.newEmpMgr){
                                managerName = manager[i]
                                managerNameArray = managerName.split(" ")
                            }
                        }
                    
                        const query3 = 'SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id FROM employees'
                        connection.query(query3, (err, res) => {
                            if (err) throw err
        
                            for(i=0;i<res.length;i++){
                                if (managerNameArray[0] === res[i].first_name){
                                    if(managerNameArray[1] === res[i].last_name){
                                        managerID = res[i].id
                                    }
                                }
                            }
                            //add the employee to db
                            const query = 'INSERT INTO employees (first_name,last_name,role_id,manager_id) VALUES (?)'
                            const values =  [answer.newFirstName, answer.newLastName, titleID, managerID]
                            connection.query(query, [values], (err) => {
                                if (err) throw err
                                console.table("New employee added.")
                                promptUser()
                            })
                        })
                    })
                })
            })
        })
    })
}

const removeEmployee = () => {
    const employeesArray = []
    
    const query = 'SELECT concat(first_name, " ", last_name) AS employee_name FROM employees'
    connection.query(query, (err, res) => {
        if (err) throw err
        for(i=0;i<res.length;i++){
            employeesArray.push(res[i].employee_name)
        }
        inquirer.prompt([
        {
            type: 'list',
            message: "Which employee would you like to remove?",
            choices: employeesArray,
            name: 'whichEmployee'
        }
        ])
        .then ((res) => {
            inquirer.prompt([
                {
                    type: 'confirm',
                    message: "Would you like to remove "+res.whichEmployee+"?",
                    name: 'confirmRemoval'
                }
            ]) 
            .then((answer) => {
                if(answer.confirmRemoval){
                    const query2 = 'SELECT concat(first_name, " ", last_name) AS employee_name FROM employees'
                    let employeeNameArray = []
                    connection.query(query2, (err, response) => {
                        if (err) throw err
                        for(i=0;i<employeesArray.length;i++){                        
                            if(res.whichEmployee == response[i].employee_name){
                                employeeNameArray = res.whichEmployee.split(" ")
                            }
                        }
                        const query3 = 'SELECT employees.id, employees.first_name, employees.last_name FROM employees'
                        let employeeID = null
                        connection.query(query3, (err, res2) => {
                            if (err) throw err        
                            for(i=0;i<employeesArray.length;i++){
                                if (employeeNameArray[0] === res2[i].first_name){
                                    if(employeeNameArray[1] === res2[i].last_name){
                                        employeeID = res2[i].id
                                    }
                                }
                            }
                            const query4 = 'DELETE FROM employees WHERE ?'
                            connection.query(query4,{ id: employeeID }, (err) => {
                                if (err) throw err
                                console.log('Employee successfully removed.')
                                promptUser()
                            })
                        })
                    })
                }
                else {
                    promptUser()
                }
            })
        })
    })
}

const updateEmployeeRole = () => {
    const employeesArray = []
    const query = 'SELECT concat(first_name, " ", last_name) AS employee_name FROM employees'
    connection.query(query, (err, res) => {
        if (err) throw err
        for(i=0;i<res.length;i++){
            employeesArray.push(res[i].employee_name)
        }
        const roleArray = []
        const query2 = 'SELECT role.id, role.title FROM role'
        connection.query(query2, (err, res2) => {
            if (err) throw err
            for(i=0;i<res2.length;i++){
                roleArray.push(res2[i].title)
            }
            inquirer.prompt([
            {
                type: 'list',
                message: "Which employee's role would you like to change?",
                choices: employeesArray,
                name: 'whichEmployee'
            }
            ])
            .then ((res) => {
                inquirer.prompt([
                    {
                        type: 'list',
                        message: "What is "+res.whichEmployee+"'s new role?",
                        choices: roleArray,
                        name: 'whichRole'
                    }
                ]) 
                .then((answer) => {
                    const query3 = 'SELECT role.id, role.title FROM role'
                    connection.query(query3, (err, role) => {
                        if (err) throw err
                        
                        //set variables for ID
                        let roleID = null
                    
                        //get the role ID of the employee's new role
                        for(i=0;i<role.length;i++){
                            if (answer.whichRole == role[i].title){
                                roleID = role[i].id
                            }
                        } 
                        const query4 = 'SELECT concat(first_name, " ", last_name) AS employee_name FROM employees'
                        connection.query(query4, (err, response) => {
                            if (err) throw err
                            for(i=0;i<employeesArray.length;i++){                        
                                if(res.whichEmployee == response[i].employee_name){
                                    const employeeNameArray = res.whichEmployee.split(" ")
                                
                                    const query5 = 'SELECT employees.id, employees.first_name, employees.last_name FROM employees'
                                    let employeeID = null
                                    connection.query(query5, (err, res2) => {
                                        if (err) throw err        
                                        for(i=0;i<employeesArray.length;i++){
                                            if (employeeNameArray[0] === res2[i].first_name){
                                                if(employeeNameArray[1] === res2[i].last_name){
                                                    employeeID = res2[i].id
                                                
                                                    const query6 = 'UPDATE employees SET ? WHERE?'
                                                    connection.query(query6, [
                                                    {role_id: roleID,},
                                                    {id: employeeID}
                                                    ], (err) => {
                                                        if (err) throw err
                                                        console.log("Employee role updated.")
                                                        promptUser()
                                                    })
                                                }
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    })
                })
            })
        })
    })
}

addNewDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: "Enter the new department name.",
            name: 'newDeptName',
            validate: function(input){
                if(input === ""){
                    console.log("Department name is required.")
                    return false
                }
                else {
                    return true
                }
            }
        }
    ])
    .then ((answer) => {
        const query = 'INSERT INTO department SET ?'
        connection.query(query, {name: answer.newDeptName}, (err) => {
        if (err) throw err
            console.log("Succesfully added new department.")
            promptUser()
        })
    })
}

addNewRole= () => {
    const query = 'SELECT name FROM department'
    connection.query(query,(err, response) => {
        if (err) throw err
        const deptNameArray = response
        inquirer.prompt([
            {
                type: 'input',
                message: "Enter the new role title.",
                name: 'newRoleTitle',
                validate: function(input){
                    if(input === ""){
                        console.log("Role title is required.")
                        return false
                    }
                    else {
                        return true
                    }
                }
            },
            {
                type: 'input',
                message: "Enter the new role's salary (must be decimal, i.e., ####.##).",
                name: 'newRoleSalary',
                validate: function(input){
                    if(input === ""){
                        console.log("Salary is required.")
                        return false
                    }
                    else {
                        return true
                    }
                }
            },
            {
                type: 'list',
                message: "Choose the new role's department.",
                choices: deptNameArray,
                name: 'newRoleDepartment'
            }
        ]) 
        .then ((answer) => {
                
            const query2 = 'SELECT * FROM department'
            const departmentID = []
            connection.query(query2, (err, response) => {
                if (err) throw err
                for(i=0;i<deptNameArray.length;i++){
                    if(answer.newRoleDepartment == response[i].name){
                        departmentID.push(response[i].id)
                    }
                }
                    
                const query3 = 'INSERT INTO role SET ?'
                connection.query(query3, {title: answer.newRoleTitle, salary: answer.newRoleSalary, department_id: departmentID}, (err) => {
                    if (err) throw err
                    console.log("Succesfully added new role.")
                    promptUser()
                })
            })  
        })
    })
}

connection.connect((err) => {
    if (err) throw err
    promptUser()
})