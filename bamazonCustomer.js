if (process.stdout._handle) process.stdout._handle.setBlocking(true);

var mysql = require("mysql");
var inquirer = require("inquirer");
var con = require('console');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  con.warn("connected as id " + connection.threadId + "\n");
  inquire();

});







function inquire() {


connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    con.log("These are available items:");
    con.log(JSON.stringify(res[0]));
    con.log("\n");
    con.log("Done listing products.");

    // Create a "Prompt" with a series of questions.
inquirer
.prompt([
    // Here we give the user a list to choose from.
    { 
      type: "id",
      message: "What is item's id?",
      name: "item_id",
    }
  ])
  .then(function(inquirerResponse) {
      con.log("You are requesting item: " + inquirerResponse.item_id);
      var item_id = inquirerResponse.item_id;

    });

});




}

