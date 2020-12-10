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
        
        switch(answer.firstQuestion){
            case "View all employees":
               viewAllEmployees();
                break;
            case "View all employees by manager":
                employeeByManager()
                break;
            case "View all employees by department":
                break;
            case "Add employee":
                addEmployee();
                break;
            case "Remove employee":
                deleteEmployee()
                break;
            case "Update employee role":
                break;
            case "View departments":
                viewDepartment()
                break;
            case "Add departments":
                addDepartment()
                break;
            case "Delete departments":
                deleteDepartment()
                break;
            case "View roles":
                viewRole()
                break;
            case "Add roles":
                addRole()
                break;
            case "Delete roles":
                deleteRole()
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
           
        })
        
        
    })
}
//----------------------------------------------------

function viewDepartment(){
    connection.query("SELECT * FROM department",function(err,data){
        if(err) throw err
        console.log("The value below is the data given by the query: ")
        console.table(data)

    })
};
//---------------------------------------------------------

//function used to invoke the prompts when adding roles
function addRole_InquirerPrompt(departmentArray){

    //Creating an array of department names based on what's currently in the sql database
    var departmentChoicesArray = [];
    for(let i in departmentArray){
        departmentChoicesArray.push(departmentArray[i].name)
    }
    //-----
    
    inquirer.prompt([
        {
            name:"title",
            message:"What is the name of the role?",
            type:"input"
        },
        {
            name:"salary",
            message:"What is this role's salary (must be in decimal format: $--.00)",
            type:"input"
        },
        {
            name:"department",
            message:"What is the name of the department this role falls under?",
            type:"list",
            choices: departmentChoicesArray
            

        }
    ]).then((answer)=>{

        connection.query(`SELECT id FROM department WHERE name='${answer.department}'`,function(err,data){
            if(err) throw err
            console.log(data)
            console.log(data[0].id)
          
            connection.query(`INSERT INTO role (title,salary,department_id) VALUES('${answer.title}',${answer.salary},${data[0].id})`,function(err,data){
                if(err) throw err
                
                choiceToContinue()
            })
            

        })

    })


}

//function used to add roles to the role database
function addRole(){
    
    
    connection.query("SELECT * FROM department",function(err,data){
        if(err) throw err
        addRole_InquirerPrompt(data)
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

    connection.query("SELECT title, id FROM role",function(err,roleData){

        

                if(err) throw err
                console.log(roleData)

                var roleDataTitleArray = [];
                for(let i in roleData){
                    roleDataTitleArray.push(roleData[i].title)
                };

                var managerDataIdArray = [];
                for(let j in roleData){
                    if(roleData[j].title.includes("Manager")){

                        managerDataIdArray.push(roleData[j].title)
                    }
                };

                switch(managerDataIdArray.length>0){

                    case false:
                        
                        inquirer.prompt([
                            {
                                name:"noManager",
                                message:"It looks like you dont't have any managers in your roles table. You need at least one manager to to begin updating your employees table. Would you like to go back and add a manager? (If you do, make sure to include the word 'Manager' in the roles name)",
                                type:"list",
                                choices:["Yes","No"]
                            }
                        ]).then((answer)=>{
                            if(answer.noManager==="Yes"){
                                addRole()
                            }else{
                                choiceToContinue()
                            }
                        })

                        
                        break;

                    case true:
                                
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
                                        message:"What is the employees role/title?",
                                        type:"list",
                                        choices: roleDataTitleArray
                            
                                    },
                                    {
                                        name:"employeeManager",
                                        message:"What manager will this employee fall under?",
                                        type:"list",
                                        choices: managerDataIdArray
                                    }
                            
                            
                                ]).then((answer)=>{
                            
                                    
                                    
                                for(let k in roleData){
                            
                
                                        if(roleData[k].title===answer.employeeRole){
                
                                                connection.query(`SELECT id FROM role WHERE title='${answer.employeeManager}'`,function(err,managerData){
                                                    if(err) throw err
                                                    console.log(managerData[0].id)
                                                    console.log(managerData[0])
                                                    
                                                    connection.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES('${answer.firstName}','${answer.lastName}',${roleData[k].id},${managerData[0].id})`,function(err,insertData){
                                                        if(err) throw err
                                                        choiceToContinue()
                                                    })
                                                    
                                                })
                    
                                        }
                
                                    
                                }
                              
                                    
                                })





                }
                 
                



        

    })
           


};
//-------------------------------------------------------------

function viewAllEmployees(){
    //this will be a query to the database
    connection.query("SELECT * FROM employee", function(err,data){
        console.table(data)

        choiceToContinue()
    })
}
//-------------------------------------------------------------
function choiceToContinue(){
    inquirer.prompt({
        name:"continue",
        message:"Would you like to continue editing employee data?",
        type:"list",
        choices:["Yes","No"]
    }).then((answer)=>{
        if(answer.continue==="Yes"){
            firstQuestion()
        }else{
            console.log("press 'Ctrl+c' to exit Node...")
            return
        }
    })
}
//---------------------------------------
function deleteDepartment(){

    connection.query("SELECT name FROM department",function(err,departmentData){

        //Creating an array of department names based on what's currently in the sql database
        var departmentChoicesArray = [];
        for(let i in departmentData){
            departmentChoicesArray.push(departmentData[i].name)
        }
        //-------

        inquirer.prompt([{
            name:"delete",
            message:"Which department would you like to remove from the database?",
            type:"list",
            choices:departmentChoicesArray
        }]).then(answer=>{

            connection.query(`DELETE FROM department WHERE name='${answer.delete}'`,function(err,deletionData){
                if(err) throw err
               
                choiceToContinue()
            })
        })

    })
}
//----------------------------------------------
function deleteRole(){

    connection.query("SELECT title FROM role",function(err,roleData){

        //Creating an array of department names based on what's currently in the sql database
        var roleChoicesArray = [];
        for(let i in roleData){
            roleChoicesArray.push(roleData[i].title)
        }
        //-------

        inquirer.prompt([{
            name:"delete",
            message:"Which role would you like to remove from the database?",
            type:"list",
            choices:roleChoicesArray
        }]).then(answer=>{

            connection.query(`DELETE FROM role WHERE title='${answer.delete}'`,function(err,deletionData){
                if(err) throw err
               
                choiceToContinue()
            })
        })

    })
}
//---------------------------------------------
function deleteEmployee(){

    connection.query("SELECT * FROM employee",function(err,employeeData){

        //Creating an array of department names based on what's currently in the sql database
        var employeeChoicesArray = [];
        for(let i in employeeData){
            employeeChoicesArray.push(employeeData[i].first_name+" "+employeeData[i].last_name)
        }
        //-------

        inquirer.prompt([{
            name:"delete",
            message:"Which employee would you like to remove from the database?",
            type:"list",
            choices:employeeChoicesArray
        }]).then(answer=>{

                    var answerArray = answer.delete.split(" ")
           
                    connection.query(`DELETE FROM employee WHERE first_name ='${answerArray[0]}' AND last_name='${answerArray[1]}'`,function(err,employeeData){
                        if(err) throw err
                    
                        choiceToContinue()
                        
                    })

               


            
        })

    })
}
//---------------------------------------------
function employeeByManager(){

    connection.query("SELECT * FROM employee",function(err,data){

        var managerNames = []
        for(let i in data){
            managerNames.push(data[i].first_name+" "+data[i].last_name)
        }

        inquirer.prompt([
            {
                name:"manager",
                message:"Which employee do you want to see direct reports for?",
                type:"list",
                choices:managerNames
            }
        ]).then((answer)=>{

            var managerNameArray = answer.manager.split(" ");

            for(let j in data){
                if(data[j].first_name===managerNameArray[0]&&data[j].last_name===managerNameArray[1]){
                    var managerId = data[j].role_id;

                    connection.query(`SELECT * FROM employee WHERE manager_id='${managerId}'`,function(err,data){
                        if(err) throw err
                        console.table(data)

                        choiceToContinue()
                    })
                }
            }
        })


    })
}
//---------------------------------------------

//call first question function
firstQuestion()