const bodyParser = require('body-parser');

var middlewareObj = {};

middlewareObj.checkRole = function checkRole(req, res, next){
    if(req.body.role === "customer"){
        res.locals.role = "customerLocal";
    }
    else {
        res.locals.role = "vendorLocal";
    }
    next();
}

middlewareObj.isLoggedInCustomer = function isLoggedInCustomer(req, res, next) {
    if(req.isAuthenticated() && req.session.strategy === "customerLocal"){
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}

module.exports = middlewareObj;