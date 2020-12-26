const express = require("express"); 
const router = express.Router();

const Store = require("../models/store");
const Order = require("../models/order");
const middlewareObj = require('../middleware');

router.get("/notification", middlewareObj.isLoggedIn, (req, res) => {
    if(req.session.strategy === "customerLocal"){
        Order.find({customer: req.session.currentUser._id}).populate("store").exec((err, customerOrders) => {
            if(err){
                console.log(err);
            }
            else{
                res.render("notification", {customerOrders: customerOrders});
            }
        })
    }
})

router.post("/notification/:order_id/cancel", (req, res) => {
    Order.findByIdAndUpdate(
        req.params.order_id, 
        {isCancelled: true},
        (err, updatedOrder) => {
            req.flash("success", "Order cancelled");
            res.redirect("/notification");
        }
    )
})

module.exports = router;
  