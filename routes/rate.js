const express = require("express"); 
const router = express.Router();


const Order = require("../models/order");
const Vendor = require("../models/vendor");
const middlewareObj = require('../middleware');

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



module.exports = router;
