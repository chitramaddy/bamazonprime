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

      case 'View Low Inventory':
        viewLowInventory();
        break;

      case 'Add to Inventory':
        addInventory();
        break;

      case 'Add New Product':
        addProduct();
        break;
    }

  })
}

//read the products file from the database with ids, names, prices, quantities
function viewProducts() {
  connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function (err, res) {
    console.log("Products for sale");
    for (var i = 0; i < res.length; i++) {
      console.log("======================");
      console.log("Id: " + res[i].item_id + "  ||  Department: " + res[i].department_name + "  ||  Product: " + res[i].product_name + "  ||  Price($): " + parseFloat(res[i].price).toFixed(2) + "  ||  In stock: " + res[i].stock_quantity);
    }
  });
  displayChoices();
}

//if(stock-quantity<5), display those items
function viewLowInventory() {
  connection.query("SELECT item_id, product_name, price, department_name, stock_quantity FROM products", function (err, res) {
    if (err) throw err;

    console.log("Following items are low in stock:")
    var lowInventoryFound = false;
    for (var i = 0; i < res.length; i++) {
      if (parseInt(res[i].stock_quantity) < 5) {
        lowInventoryFound = true;
        console.log("==============================");
        console.log("Id: " + res[i].item_id + "  ||  Department: " + res[i].department_name + "  ||  Product: " + res[i].product_name + "  ||  Price($): " + parseFloat(res[i].price).toFixed(2) + "  ||  In stock: " + res[i].stock_quantity);
      }
    }
    if (!lowInventoryFound) {
      console.log("You do not have any items on low inventory");
    }
  });
  displayChoices();
}

//addInventory()--Use inquirer to ask for quantity and item to be added, and update database


function askquestions() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;

    //Take manager input for the item they would like to buy
    inquirer.prompt([{
      name: 'item',
      type: 'input',
      message: 'Please enter the Id of the item you want to update',
      validate: function (value) {
        if (isNaN(parseInt(value)) === false) {
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

          getQuantity(chosenItem);

        }
      }
    })

  })
}

function getQuantity(chosenItem) {
  // Take manager input for quantity
  inquirer.prompt([{
    name: 'Qty',
    type: 'input',
    message: 'How many of ' + chosenItem.product_name + ' would you like to add to the stock?',
    validate: function (value) {
      if (isNaN(value) === false) {
        return true;
      }
      console.log("You did not enter a valid id");
      return false;
    }
  }]).then(function (answer) {
    //Update the products table reflecting reduced stock
    connection.query(
      'UPDATE products SET ? WHERE ?',

      [{
          stock_quantity: parseInt(chosenItem.stock_quantity) + parseInt(answer.Qty)
        },
        {
          item_id: chosenItem.item_id
        }
      ],
      function (err) {
        if (err) throw err;
        console.log("Invetory updated with " + answer.Qty + " " + chosenItem.product_name);
      });

  });
}

function addInventory() {
  askquestions();
}


//addProduct()--Use inquirer to check what products need to be added, insert into database
function addProduct() {
  inquirer.prompt([{
      name: "product",
      type: "input",
      message: "Please enter the name of the product you want to add"
    },

    {
      name: "department",
      type: "input",
      message: "Please enter the department name"
    },

    {
      name: "price",
      type: "input",
      message: "Please enter the unit price of the item"
    },

    {
      name: "Qty",
      type: "input",
      message: "Please enter the stock quantity",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        console.log("You did not enter a valid id");
        return false;
      }
    }
  ]).then(function (answer) {
    connection.query("INSERT INTO products SET ?",

      {
        product_name: answer.product,
        department_name: answer.department,
        price: parseInt(answer.price),
        stock_quantity: answer.Qty
      },
      function (err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " products inserted.")
      });
  });
  displayChoices();
}