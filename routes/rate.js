const express = require("express"); 
const router = express.Router();
const Order = require("../models/order");
const Vendor = require("../models/vendor");
const Rating = require("../models/rate");

const middlewareObj = require('../middleware');
const bodyParser = require('body-parser');
const { urlencoded } = require("body-parser");
const { db } = require("../models/rate");

router.get("/Rate", middlewareObj.isLoggedIn, async (req, res) => {
    
        Order.find({customer: req.session.currentUser._id}).populate("store").sort({createdAt: -1}).exec((err, customerOrders) => {
            if(err){
                console.log(err);
            }
            else{
                res.render("Rate", {orders: customerOrders});
            }
        })
    
 
})
router.post("/landing", (req, res) => {
    
        console.log(req.body);
    



})


module.exports = router;
