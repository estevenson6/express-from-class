const express = require("express");
const hbs = require("hbs");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');


const Pizza = require("./models/Pizza.model");

const app = express();

app.use(express.static('public')); // Make everything inside of public/ available

app.set("views", __dirname + "/views"); //tells our Express app where to look for our views
app.set("view engine", "hbs"); //sets HBS as the template engine

hbs.registerPartials(__dirname + "/views/partials"); //tell HBS which directory we use for partials

app.use(bodyParser.urlencoded({ extended: true }));


mongoose
  .connect('mongodb://127.0.0.1/loopeyRestaurant')
  .then(x => {
    console.log(`Connected! Database name: "${x.connections[0].name}"`);
  })
  .catch( e => console.log("error connecting to DB", e));



/**********/
/* Routes */
/**********/


// GET /
app.get("/", (req, res, next) => {
    res.render("home-page");
});


// GET /contact
app.get("/contact", (req, res, next) => {
    res.render("contact-page");
});


// GET /pizzas
app.get("/pizzas", (req, res, next) => {

    // console.log(req.query); // req.query is an object
    // console.log(typeof req.query.maxPrice); // we will receive a string

    // const {maxPrice} = req.query; // using object destructuring
    
    let maximumPrice = req.query.maxPrice;
    maximumPrice = Number(maximumPrice); //convert to a number


    let filter = {}
    if(maximumPrice){
        filter = {price: {$lte: maximumPrice}};
    }


    Pizza.find(filter)
        .then( (pizzas) => {

            const data = {
                pizzasArr: pizzas
            }

            res.render("product-list", data)
        })
        .catch( e => console.log("error getting pizzas from DB", e));


});


// GET /pizzas/:pizzaName
app.get("/pizzas/:pizzaName", (req, res, next) => {
    
    // console.log(req.params.pizzaName);

    Pizza.findOne({title: req.params.pizzaName})
        .then( (pizzaFromDB) => {
            // console.log(pizzaFromDB)
            res.render("product", pizzaFromDB);
        })
        .catch( e => console.log("error getting pizza from DB", e));

});




//
// ROUTE PARAMS
//

app.get("/drinks/:drinkName", (req, res, next) => {
    console.log(req.params);
    res.send(`display info about.... ${req.params.drinkName}`);
});



//
// EXAMPLE OF A POST REQUEST + req.body
//

app.post("/login", (req, res, next) => {

    // console.log(req.body)

    const email = req.body.emailaddress;
    const pwd = req.body.pwd;

    if(pwd === "1234"){
        res.send("welcome!")
    } else {
        res.send("wrong password")
    }

})



app.listen(3000, () => { console.log("server listening on port 3000...")});