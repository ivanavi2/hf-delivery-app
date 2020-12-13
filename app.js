const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require("method-override");
const flash = require('connect-flash');


const Customer = require("./models/customer");
const Vendor = require("./models/vendor");
const middlewareObj = require('./middleware');

const storeRoutes = require("./routes/store");
const indexRoutes = require("./routes/index");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const chatRoutes = require("./routes/chat");
const vendorRoutes = require("./routes/vendor");
/*
const customerRoutes = require("./routes/customer");
const cartRoutes = require("./routes/cart"); */

//"mongodb://localhost/appdev_test" || process.env.DATABASEURL
//process.env.DATABASEURL || "mongodb://localhost/appdev_test"  
//Mongodb config
//mongodb+srv://bizbuzbiz:ivantehteh1@cluster0.gumfa.mongodb.net/hf-delivery?retryWrites=true&w=majority
mongoose.connect("mongodb://localhost/appdev_test" || process.env.DATABASEURL  , 
    {useNewUrlParser: true,
    useUnifiedTopology: true})
.then(() => console.log("Connected to DB!"))    
.catch((error) => console.log(error.message));

/* mongoose.connect("mongodb+srv://bizbuzbiz:ivantehteh1@cluster0.gumfa.mongodb.net/hf-delivery?retryWrites=true&w=majority", 
    {useNewUrlParser: true,
    useUnifiedTopology: true})
.then(() => console.log("Connected to DB!"))    
.catch((error) => console.log(error.message)); */

//Other config
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.set("view engine", "ejs");

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(storeRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(chatRoutes);
app.use(vendorRoutes);
/* app.use(vendorRoutes);
app.use(customerRoutes);
app.use(cartRoutes);
 */

app.listen(process.env.PORT || 3000, () => {
    console.log("Listening to hfd_copy");
}) 