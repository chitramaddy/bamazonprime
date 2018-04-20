var mysql = require("mysql");
var inquirer = require("inquirer");

//variable to refer the database connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // username
  user: "root",

  // password
  password: "root",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  readProducts();
});

//readproducts to display the items to the customer.
function readProducts() {
  connection.query("SELECT item_id, product_name, department_name, price FROM products", function (err, res) {
    console.log("Product list");
    for (var i = 0; i < res.length; i++) {
      console.log("======================");
      console.log("Id: " + res[i].item_id + "||Department: " + res[i].department_name + "|| Product: " + res[i].product_name + "||Price($): " + parseFloat(res[i].price));
    }
    askquestions();
  })
}

//function to take customer order
function askquestions() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;

    //Take customer input for the item they would like to buy
    inquirer.prompt([{
      name: 'item',
      type: 'input',
      message: 'Please enter the Id of the item you want to buy',
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        console.log("You did not enter a valid id");
        return false;
      }
    }]).then(function (answer) {
      var chosenItem;
      for (var i = 0; i < results.length; i++) {
        if (parseInt(results[i].item_id) === parseInt(answer.item)) {
          chosenItem = results[i];

          // Take customer input for quantity
          inquirer.prompt([{
            name: 'Qty',
            type: 'input',
            message: 'How many of ' + chosenItem.product_name + ' would you like to buy?',
            validate: function (value) {
              if (isNaN(value) === false) {
                return true;
              }
              console.log("You did not enter a valid id");
              return false;
            }
          }]).then(function (answer) {
            console.log("You placed an order for " + answer.Qty + " " + chosenItem.product_name);

            //To check if there is enough stock to fulfill customer order
            if (chosenItem.stock_quantity < answer.Qty) {
              console.log("We cannot fulfill your order at this time due to insufficient stock");
              readProducts();
            } else {
              console.log("Your order value is $" + chosenItem.price * answer.Qty);
              console.log("Order placed successfully!!!");
              readProducts();

              var currentStock;
              currentStock = parseInt(chosenItem.stock_quantity) - parseInt(answer.Qty);

              //Update the products table reflecting reduced stock
              connection.query(
                'UPDATE products SET ? WHERE ?',

                [{
                    stock_quantity: parseInt(currentStock)
                  },
                  {
                    item_id: chosenItem.item_id
                  }
                ],
                function (err) {
                  if (err) throw err;
                }
              )
            }
          })

        }
      }
    })

  })
}
