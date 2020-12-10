const inquirer = require("inquirer");
const mysql = require("mysql");


//set up a connection to mysql
var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "7%#ll3R#R@nF#90^T&!e",
    database: "employee_tracker_DB"
})

connection.connect(function(err){
    if(err) throw err
})
//----------------------------------------

//use inquirer to prompt user for information
function firstQuestion(){

    inquirer.prompt(
        {
            name:"firstQuestion",
            message:"What would you like to do?",
            type:"list",
            choices:["View all employees","View all employees by manager","View all employees by department","Add employee","Remove employee","Update employee role","View departments","Add departments","Delete departments","View roles","Add roles","Delete roles"]

        }
    ).then((answer)=>{
        console.log(answer.firstQuestion)
        switch(answer.firstQuestion){
            case "View all employees":
               // viewAllEmployees();
                break;
            case "View all employees by manager":
                break;
            case "View all employees by department":
                break;
            case "Add employee":
               // addEmployee();
                break;
            case "Remove employee":
                break;
            case "Update employee role":
                break;
            case "View departments":
                //viewDepartment()
                break;
            case "Add departments":
                addDepartment()
                break;
            case "Delete departments":
                break;
            case "View roles":
                //viewRole()
                break;
            case "Add roles":
               // addRole()
                break;
            case "Delete roles":
                break;
        }
    })

};
//-------------------------------------------------------------------


function addDepartment(){
    inquirer.prompt([
        {
            name:"name",
            message:"What is the name of the department you want to add?",
            type:"input"

        }
    ]).then((answer)=>{
        connection.query(`INSERT INTO department (name) VALUES ('${answer.name}')`,function(err,data){
            if(err) throw err
            console.log(data)
        })
        console.log(answer)
        console.log("This is the answer type: ")
        console.log(typeof answer)
    })
}
//----------------------------------------------------
/*
function viewDepartment(){
    connection.query("SELECT * FROM department",function(err,data){
        if(err) throw err
        console.table(data)
    })
};
//---------------------------------------------------------

function addRole(){
    inquirer.prompt([
        {
            name:"title",
            message:"What is the name of the role?",
            type:"input"
        },
        {
            name:"salary",
            message:"What is this role's salary",
            type:"input"
        },
        {
            name:"department",
            message:"What is the name of the department this role falls under?"
        }
    ]).then((answer)=>{
        connection.query(`INSERT INTO role (title,salary,department_id) VALUES(${answer.title},${answer.salary},${answer.department}`,function(err,data){
            if(err) throw err
            console.log(data)
        })
    })
};
//--------------------------------------------------------
function viewRole(){
    connection.query("SELECT * FROM role",function(err,data){
        if(err) throw err
        console.table(data)
    })
};
//--------------------------------------------------------

function addEmployee(){
    inquirer.prompt([
        {
            name:"firstName",
            message:"What's the employees first name?",
            type:"input"
        },
        {
            name:"lastName",
            message:"What's the employees last name?",
            type:"input"
        },
        {
            name:"employeeRole",
            message:"What is the employees role?",
            type:"list",
            choices:["Engineer","Account Manager","Sales Lead"]

        },
        {
            name:"employeeManager",
            message:"Who will be the employees manager?",
            type:"list",
            choices:["John Doe","Jake Blake","Paul Wall"]
        }


    ]).then((answer)=>{

        console.log(answer)
        //---
        connection.query("INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES(``)",function(err,data){
    
        })
        //--
    })
};
//-------------------------------------------------------------

function viewAllEmployees(){
    //this will be a query to the database
    connection.query("SELECT * FROM employee", function(err,data){
        console.table(data)
    })
}
//-------------------------------------------------------------

*/


//call first question function
firstQuestion()