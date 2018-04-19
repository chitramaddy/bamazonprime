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
function readProducts(){
  connection.query("SELECT item_id, product_name, department_name, price FROM products", function(err, res){
    console.log("We have the following on sale");
    for (var i = 0; i < res.length; i++){
      console.log("======================");     
      console.log("Item Id: "+res[i].item_id+"||Department :"+res[i].department_name+"|| Product: "+res[i].product_name+"||Price: "+parseFloat(res[i].price));

    }
  })
}




//Use inquirer to list the name of the products and let the customer choose the product 

//use inquirer to ask the number of items the customer wants to buy
//validate if the customer input is a number

//check if customer.order<stock_quantity for the item. if yes, calculate the total price and console log it.
//update the database for the item by reducing the number of items customer ordered

//if not, console.log out of stock message

//ask the customer if he wants to place another order. startover.
