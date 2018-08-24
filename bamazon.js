var mysql = require("mysql");
var inquirer = require(`inquirer`);

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

var activeNumber = 0;


connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});



function listItems() {
    connection.query("SELECT * FROM stock", function (err, res) {
        //      "SELECT flavor,price",
        if (err) throw err;
        console.log(`~~~~~~~~~~~~~~~`);
        for (i = 0; i < res.length; i++) {
            console.log(`Item: ${res[i].item} |Items Remaining: ${res[i].quantity} |Price: $${res[i].price}`)
        }
        console.log(`~~~~~~~~~~~~~~~`);
        ending();
    });
};

function updateProduct(numPurchased, itemName) {
    connection.query(
        "UPDATE stock SET quantity = quantity - ? WHERE ?",
        [

            numPurchased
            ,
            {
                item: itemName
            }
        ],
        function (err, res) {
            if (err) {
                throw err
            }

        });
        
    console.log(`\nThank you for your purchase\n`)
    ending();
};

function ending() {

    inquirer.prompt([
        {
            type: "list",
            name: "next",
            message: "Would you like to keep going?",
            choices: ["Yes take me back", "No I would like to exit"]
        }
    ]).then(function (ref) {
        if (ref.next == "Yes take me back") {
            start();
        }
        else {
            console.log(`\nThanks for stopping by!\n`)
            connection.end();
        }
    });

}


function buyNow() {
    connection.query("SELECT * FROM stock", function (err, res) {

        if (err) throw err;

        var activeName = [];
        var activePrice = [];
        var activeId = [];
        var activeQuantity = [];
        var userChoices = [];
        for (i = 0; i < res.length; i++) {
            activeId.push(res[i].id);
            activeName.push(res[i].item);
            activePrice.push(res[i].price);
            activeQuantity.push(res[i].quantity)
            var newChoice = res[i].item + ' $' + res[i].price
            userChoices.push(newChoice);
        }
        activeName.push(`Return to menu`)
        console.log(`~~~~~~~~~~~~~~~`);

        inquirer.prompt([
            {
                type: "list",
                name: "bid",
                message: "What would you like to buy?",
                choices: userChoices
            }
        ]).then(function (answer) {
            if (answer.bid === `Return to menu`) {
                start();
            }
            else {

                activeNumber = activeName.indexOf(answer.bid)
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'numBid',
                        default: 'number',
                        message: 'How many would you like to buy?'
                    }
                ]).then(function (ref) {
                    if (activeQuantity[activeNumber] < ref.numBid) {
                        console.log(`Sorry We Dont Have That Many`)
                        console.log(`We Currently Have ${activeQuantity[activeNumber]}`)
                        start();
                    }
                    else if(ref.numBid===0){
                        ending();
                    }
                    else {
                        updateProduct(ref.numBid, answer.bid);
                    }

                })
            }
        })


    });
}


function start() {

    inquirer.prompt([
        {
            type: `list`,
            name: `options`,
            message: `What would you like to do?`,
            choices: [`View Active Listings`, `Make A Purchase`, `Exit`]
        }
    ]).then(function (answers) {
        
        if (answers.options === `View Active Listings`) {
            console.log(`You Chose View Active Listings`);
            listItems();
        }
        else if (answers.options === `Make A Purchase`) {
            console.log(`You Chose Make A Purchase`);
            buyNow();
        }
        else if (answers.options === `Exit`) {
            console.log(`Thanks for stopping by!`)
            ending();
        }
        else {
            console.log(`\nSomething went Wrong`);
            console.log(`Please Exit And Try Again\n`);
            connection.end();
        }
    })
}







