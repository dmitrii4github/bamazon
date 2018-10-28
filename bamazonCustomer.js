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
    con.log("These are available items:\n");
    for (var i=0; i<res.length; i++) {
        con.log(JSON.stringify(res[i]));
        con.log("\n");
    }

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
      
      inquirer
      .prompt([
      // Here we give the user a list to choose from.
      { 
         type: "quantity",
         message: "How many units would you like to buy?",
         name: "item_quantity",
      }
      ])
      .then(function(inquirerResponse) {
            con.log("You are requesting " + inquirerResponse.item_quantity + " items.");
            var item_quantity = inquirerResponse.item_quantity;
            con.log("item_id: "+item_id);
            connection.query("SELECT stock_quantity FROM products WHERE item_id="+item_id, function(err, res) {
                if (err) throw err;
                console.log("stock_quantity: "+JSON.stringify(res));
                stock_quantity = res[0]["stock_quantity"];
                console.log("stock_quantity: "+stock_quantity);
                if (stock_quantity < item_quantity) {
                    con.log("Insufficient quantity!");
                    inquire();
                } else {
                    stock_quantity = stock_quantity - item_quantity;
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                          {
                            stock_quantity: stock_quantity
                          },
                          {
                            item_id: item_id
                          }
                        ],
                        function(error) {
                          if (error) throw err;
                          connection.query("SELECT price FROM products WHERE item_id="+item_id, function(err, res) {
                            if (err) throw err;
                            console.log("price: "+JSON.stringify(res));
                            price = res[0]["price"];
                            console.log("price: "+ price);
                            console.log("Your order is fulfilled! Total cost is "+price*item_quantity+". Updated stock_quantity.");
                            inquire();
                          });
                          
                        }
                      );
            
                }
            });
      });

    });

});


}

