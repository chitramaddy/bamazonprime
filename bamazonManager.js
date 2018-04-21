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
  displayChoices();
});

//use inquirer to ask the manager what he wants to do from the list

function displayChoices() {
  inquirer.prompt([{
    name: 'action',
    type: 'list',
    message: "what would you like to do?",
    choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']

  }]).then(function (answer) {
    //Write switch case with functions for each of the options
    switch (answer.action) {
      case 'View Products for Sale':
        viewProducts();
        break;

      case 'View Low Invetory':
        viewLowInvetory();
        break;

        // case 'Add to Inventory':
        //   addInventory();
        //   break;

        // case 'Add New Product':
        //   addProduct();
        //   break;
    }

  })
}

//read the products file from the database with ids, names, prices, quantities
function viewProducts() {
  connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function (err, res) {
    console.log("Products for sale");
    for (var i = 0; i < res.length; i++) {
      console.log("======================");
      console.log("Id: " + res[i].item_id + "||Department: " + res[i].department_name + "|| Product: " + res[i].product_name + "||Price($): " + parseInt(res[i].price) + "|| In stock: " + res[i].stock_quantity);
    }
  })
}

function viewLowInvetory() {
  connection.query("SELECT item_id, product_name, department_name, stock_quantity FROM products", function (err, results) {
    if (err) throw err;
    console.log(results);

    for (var i = 0; i < results.length; i++) {
      if (parseInt(results[i].stock_quantity) < 5) {
        console.log("Id: " + results[i].item_id + "||Department: " + results[i].department_name + "|| Product: " + results[i].product_name + "||Price($): " + parseInt(results[i].price) + "|| In stock: " + results[i].stock_quantity);
      }
    }
  })
}




//viewLowInvetory()--if(stock-quantity<5), console.log those items

//addInventory()--Use inquirer to ask for quantity and item to be added, and update database

//addProduct()--Use inquirer to check what products need to be added, insert into database