const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console-table");

let roleArray = []
let employeeArray = []
let mgmtArray = []
let deptArray = []

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '@ng3l',
    database: 'employeeTrackDB'
});

const initQueries = () => {

    connection.query("SELECT role.title AS `Title`, role.id AS `ID` FROM role ORDER BY `ID`", (err, results) => {
        roleArray = [];
        results.forEach(({ Title, ID }) => {
            roleArray.push(`${ID}: ${Title}`);
        });
        return roleArray;
    });

    connection.query("SELECT CONCAT_WS(', ', employee.last_name, employee.first_name) AS `Name`, employee.id as `ID` FROM employee ORDER BY `Name`", (err, results) => {
        employeeArray = [];
        results.forEach(({ Name, ID }) => {
            employeeArray.push(`${ID}: ${Name}`);
        });
        return employeeArray;
    });

    connection.query("SELECT CONCAT_WS(', ', employee.last_name, employee.first_name) AS `Name`, employee.id as `ID` FROM employee WHERE employee.role_id = 1 ORDER BY `Name`", (err, results) => {
        mgmtArray = [];
        results.forEach(({ Name, ID }) => {
            mgmtArray.push(`${ID}: ${Name}`);
        });
        return mgmtArray;
    });

    connection.query("SELECT department.name AS `Department`, department.id AS `ID` FROM department ORDER BY `ID`", (err, results) => {
        deptArray = [];
        results.forEach(({Department, ID}) => {
            deptArray.push(`${ID}: ${Department}`);
        });
        return deptArray;
    });

}



connection.connect((err) => {
    if (err) throw err;
});