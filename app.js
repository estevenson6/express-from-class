const express = require("express");
const hbs = require("hbs");
const mongoose = require("mongoose");

const Pizza = require("./models/Pizza.model");

const app = express();

app.use(express.static('public')); // Make everything inside of public/ available

app.set("views", __dirname + "/views"); //tells our Express app where to look for our views
app.set("view engine", "hbs"); //sets HBS as the template engine

hbs.registerPartials(__dirname + "/views/partials"); //tell HBS which directory we use for partials



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


    Pizza.find()
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






app.listen(3000, () => { console.log("server listening on port 3000...")});