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

const initQueries = () => {

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
        name: "option",
        message: "Where would you like to start?",
        choices: [
            "Add",
            "View",
            "Update",
            "Finish"
        ]
    }).then((answer) => {
        if (answer.option === "Add") {
            addToList();
        }
        else if (answer.option === "View") {
            viewList();
        }
        else if (answer.option === "Update") {
            updateList();
        }
        else {
            connection.end();
        }
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
            name: "option",
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

                initQueries();
            }
        );
    });
};




connection.connect((err) => {
    if (err) throw err;
    initQueries()
});