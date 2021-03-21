const mysql = require("mysql");
const inquirer = require("inquirer");


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@ng3l',
    database: 'employeeTrackDB'
});



connection.connect((err) => {
    if (err) throw err;
});