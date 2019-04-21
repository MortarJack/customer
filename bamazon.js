var mysql = require("mysql");
var inquirer = require("inquirer");
  
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "webuser",
  password: "UCR",
  database: "bamazon"
});
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  bamazon();
});

var bamazon = function() {
  connection.query ('select * from bamazon', function(err,results) {
    if (err) throw err;
    console.log(results);
    var questions = [
      {
        name: 'question 1',
        message: 'what do you want to buy?',
      
      },
    {
      name:'question 2',
      message: ' how much do want to buy?'
    }
     
    ];
    inquirer
      .prompt(questions)
      .then(answers => {
        console.log(answers);
        stockQuantity(answers['question 1'], answers['question 2'] );
      });
  });
}

var stockQuantity = function(item, quantity){
console.log(item);
console.log(quantity);
  connection.query('select * from bamazon where ?', { product_name: item }, function(err,results) {
    if (err) throw err;
    console.log(results);
    
    var stockData = results[0];

    var randomStockQuantity = stockData.stock_quantity - quantity;
    console.log(randomStockQuantity);
    if (randomStockQuantity < 0) {
      console.log("not enough in stock for purchase");
      
    } else { 
      connection.query(
      "UPDATE bamazon SET ? WHERE ?",
      [
        {
          stock_quantity: randomStockQuantity
        },
        {
          item_id: item
        }
      ],
      function(err, res) {
        
        console.log("Product purchased!\n");
        console.log("$" + (quantity * stockData.price));
      }
    );
      
    }
  
  });
}
