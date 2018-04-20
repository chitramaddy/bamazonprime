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
      message: 'Please enter the Id of the item you want to buy'
    }]).then(function (answer) {
      var chosenItem;
      for (var i = 0; i < results.length; i++) {
       if (parseInt(results[i].item_id) === parseInt(answer.item)) {
        chosenItem = results[i];

          inquirer.prompt([{
            name: 'Qty',
            type: 'input',
            message: 'How many of '+chosenItem.product_name+' would you like to buy?'
          }]).then(function (answer) {
            console.log("You placed an order for " + answer.Qty + " " + chosenItem.product_name);
          })

        }
      }
    })

  })
}



//Use inquirer to list the name of the products and let the customer choose the product 

//use inquirer to ask the number of items the customer wants to buy
//validate if the customer input is a number

//check if customer.order<stock_quantity for the item. if yes, calculate the total price and console log it.
//update the database for the item by reducing the number of items customer ordered

//if not, console.log out of stock message

//ask the customer if he wants to place another order. startover.