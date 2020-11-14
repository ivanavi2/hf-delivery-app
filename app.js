const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require("method-override");

const Customer = require("./models/customer");
const Vendor = require("./models/vendor");
const middlewareObj = require('./middleware');

const indexRoutes = require("./routes/index");
/* const vendorRoutes = require("./routes/vendor");
const customerRoutes = require("./routes/customer");
const cartRoutes = require("./routes/cart"); */

//Other config
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//Mongodb config
mongoose.connect("mongodb://localhost/appdev_test", 
    {useNewUrlParser: true,
    useUnifiedTopology: true})
.then(() => console.log("Connected to DB!"))    
.catch((error) => console.log(error.message));

//Passport config
app.use(require("express-session")({
    secret: "ivanteholimauais",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize()); 
app.use(passport.session());
passport.use("customerLocal", new LocalStrategy({passReqToCallBack: true},Customer.authenticate()));
passport.serializeUser(Customer.serializeUser());
passport.deserializeUser(Customer.deserializeUser());
passport.use("vendorLocal", new LocalStrategy({passReqToCallBack: true},Vendor.authenticate()));
passport.serializeUser(Vendor.serializeUser());
passport.deserializeUser(Vendor.deserializeUser());

app.use((req, res, next) => {
    res.locals.role = req.session.strategy;
    res.locals.currentUser = req.user || req.session.currentUser; 
    next();
});

app.use(indexRoutes);
/* app.use(vendorRoutes);
app.use(customerRoutes);
app.use(cartRoutes);
 */

app.listen(process.env.PORT || 3000, () => {
    console.log("Listening to appdev_test");
}) 