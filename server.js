const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console-table");

let roleArray = []
let employeeArray = []
let mgmtArray = []
let deptArray = []

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "@ng3l",
    database: "employeeTrackDB"
});

const start = () => {

    connection.query("SELECT role.title AS `Title`, role.id AS `ID` FROM role ORDER BY `ID`", (err, results) => {
        roleArray = [];
        results.forEach(({ Title, ID }) => {
            roleArray.push(`${ID}: ${Title}`);
        });
        return roleArray;
    });

    connection.query("SELECT CONCAT_WS(', ', employee.first_name, employee.last_name) AS `Name`, employee.id as `ID` FROM employee ORDER BY `Name`", (err, results) => {
        employeeArray = [];
        results.forEach(({ Name, ID }) => {
            employeeArray.push(`${ID}: ${Name}`);
        });
        return employeeArray;
    });

    connection.query("SELECT CONCAT_WS(', ', employee.first_name, employee.last_name) AS `Name`, employee.id as `ID` FROM employee WHERE employee.role_id = 1 ORDER BY `Name`", (err, results) => {
        mgmtArray = [];
        results.forEach(({ Name, ID }) => {
            mgmtArray.push(`${ID}: ${Name}`);
        });
        return mgmtArray;
    });

    connection.query("SELECT department.name AS `Department`, department.id AS `ID` FROM department ORDER BY `ID`", (err, results) => {
        deptArray = [];
        results.forEach(({ Department, ID }) => {
            deptArray.push(`${ID}: ${Department}`);
        });
        return deptArray;
    });

    init()

};

const init = () => {
    inquirer.prompt({
        type: "list",
        name: "choice",
        message: "Please select an Action",
        choices: [
            "Add",
            "View",
            "Update",
            "Finish"
        ]
    }).then((answer) => {
        if (answer.choice === "Add") {
            addToList();
        }
        else if (answer.choice === "View") {
            viewList();
        }
        else if (answer.choice === "Update") {
            updateList();
        }
        else {
            connection.end();
        }
    });
};

const connectionView = (queryString) => {
    connection.query(queryString, (err, results) => {
        if (err) throw err;
        console.table(results)
        start();
    })
};


const viewList = () => {
    let queryString = ""
    inquirer.prompt(
        {
            type: "list",
            name: "viewType",
            message: "Please select a Category to View",
            choices: [
                "Role",
                "Employee Name",
                "Managers",
                "Departments"
            ]
        }
    ).then((answer) => {
        if (answer.viewType === "Employee Name") {
            queryString = "SELECT CONCAT_WS(', ', employee.first_name, employee.last_name) AS `Name`, role.title AS `Role`,role.salary AS `Salary`, department.name AS `Department`, CONCAT_WS(', ', managerInfo.first_name, managerInfo.last_name) AS `Manager` FROM employee INNER JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee AS managerInfo on employee.manager_id = managerInfo.id ORDER by `Name`"
            console.log(`~* Listing Employees Alphabetically *~`);
            connectionView(queryString);
        }
        else if (answer.viewType === "Role") {
            queryString = "SELECT role.id AS `ID`,  role.title AS `Role`, role.salary AS `Salary`, department.name AS `Department` FROM role INNER JOIN department on role.department_id = department.id ORDER BY `ID`"
            console.log(`~* Listing Roles in Numerical Order *~`);
            connectionView(queryString);
        }
        else if (answer.viewType === "Departments") {
            queryString = "SELECT department.id AS `ID`, department.name AS `Department` FROM department ORDER BY `ID`"
            console.log(`~* Listing Departments in Numerical Order *~`);
            connectionView(queryString);
        }
        else {
            byMgmt()
        };
    });
};


const byMgmt = () => {
    inquirer.prompt({
        type: "list",
        name: "manager",
        choices: mgmtArray,
        message: "Select a Manager to Order By"
    }).then((answer) => {
        let answerArrayMgmt = answer.manager.split(":").join(",").split(", ")
        const queryString = `SELECT CONCAT_WS(', ', employee.first_name, employee.last_name) AS 'Name', role.title AS 'Role', role.salary AS 'Salary', department.name AS 'Department', CONCAT_WS(', ', managerInfo.first_name, managerInfo.last_name,) AS 'Manager' FROM employee INNER JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee AS managerInfo on employee.manager_id = managerInfo.id WHERE employee.manager_id = '${answerArrayMgmt[0]}' ORDER by 'Name'`
        console.log(`~* Listing ${answerArrayMgmt[1]} ${answerArrayMgmt[2]}'s Subordinates *~`);
        connectionView(queryString);
    });
};



const updateList = () => {
    inquirer.prompt({
        type: "list",
        name: "update",
        message: "Which would you like to update?",
        choices: [
            "Role",
            "Manager"
        ]
    }).then((answer) => {
        if (answer.update === "Role") {
            updateRole();
        }
        else if (answer.update === "Manager") {
            updateMgmt();
        }
    });
};

const updateRole = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            choices: employeeArray,
            message: "Select an Employee to Update",
        },
        {
            type: "list",
            name: "role_id",
            choices: roleArray,
            message: "Please provide the Employee's New Role"
        }
    ]).then((answer) => {
        let employeeAns = answer.choice.split(":").join(",").split(", ");
        let roleAns = answer.role_id.split(":").join(",").split(", ");
        connection.query(
            "UPDATE employee SET ? WHERE ? AND ?", [
            {
                role_id: roleAns[0]
            },
            {
                first_name: employeeAns[1]
            },
            {
                last_name: employeeAns[2]
            }
        ],
            (err, res) => {
                if (err) throw err;
                console.log(`~* ${employeeAns[1]} ${employeeAns[2]}'s role is now ${roleAns[1]} *~`);

                start();
            }
        );
    });
};

const updateMgmt = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            choices: employeeArray,
            message: "Select an Employee to Update",
        },
        {
            name: "newMgmt",
            type: "list",
            choices: mgmtArray,
            message: "Please select the Employee's New Manager"
        }
    ]).then((answer) => {
        let answerArrayChoice = answer.choice.split(":").join(",").split(", ")
        let answerArrayMgmt = answer.mgmtArray.split(":").join(",").split(", ")
        const query = connection.query(
            "UPDATE employee SET ? WHERE ?", [
            {
                manager_id: answerArrayMgmt[0]
            },
            {
                id: answerArrayChoice[0]
            }
        ], (err, res) => {
            if (err) throw err;
            console.log(`~* ${answerArrayChoice[1]} ${answerArrayChoice[2]}'s New Manager is ${answerArrayMgmt[1]} ${answerArrayMgmt[2]} *~`);

            start();
        }
        );
    });
};

const addToList = () => {
    inquirer.prompt({
        name: "addNew",
        type: "list",
        message: "Please select a New Item to Create",
        choices: ["Employee", "Role", "Department"]
    }).then((answer) => {
        if (answer.addNew === "Employee") {
            newEmployee();
        }
        else if (answer.addNew === "Role") {
            newRole();
        }
        else if (answer.addNew === "Department") {
            newDept();
        }
    });
};

const newEmployee = () => {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "Enter New Employee's First Name: "
        },
        {
            name: "last_name",
            type: "input",
            message: "Enter New Employee's Last Name: "
        },
        {
            name: "role_id",
            type: "list",
            choices: roleArray,
            message: "Please select New Employee's Role"
        },
        {
            name: "manager_id",
            type: "list",
            choices: mgmtArray,
            message: "Please select New Employee's Manager"
        }
    ]).then((answer) => {
        console.log(`~* New Employee ${answer.first_name} ${answer.last_name} is Being Added to Roster *~`);
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id.split(":").join(",").split(", ")[0],
                manager_id: answer.role_id.split(":").join(",").split(", ")[0],

            }, (err) => {
                if (err) throw err;
                console.log("~* New Employee Added Successfully *~");
                start();
            });
    });
};

const newRole = () => {
    inquirer.prompt([
        {
            name: "role_title",
            type: "input",
            message: "Please provide the New Role Title"
        },
        {
            name: "salary",
            type: "input",
            message: "Please provide the New Role Salary"
        },
        {
            name: "dept_id",
            type: "list",
            choices: deptArray,
            message: "Please provide the New Role's Department"
        }
    ]).then((answer) => {
        console.log(`~* New Role ${answer.role_title} is Being Added to Roster *~`);
        connection.query("INSERT INTO role SET ?",
            {
                title: answer.role_title,
                salary: answer.salary,
                dept_id: answer.dept_id.split(":").join(",").split(", ")[0]
            }, (err) => {
                if (err) throw err;
                console.log("~* New Role Added Successfully *~");
                start();
            });
    });
};



const newDept = () => {
    inquirer.prompt([
        {
            name: "dept_name",
            type: "input",
            message: "Please provide New Department Name"
        }
    ]).then((answer) => {
        console.log(`~* New Department ${answer.dept_name} is Being Added to Roster *~`);
        connection.query("INSERT INTO department SET ?", {
            name: answer.dept_name
        }, (err) => {
            if (err) throw err;
            console.log("~* New Department Added Successfully *~");
            start();
        });
    });
};


connection.connect((err) => {
    if (err) throw err;
    start()
});