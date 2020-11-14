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

module.exports = middlewareObj;