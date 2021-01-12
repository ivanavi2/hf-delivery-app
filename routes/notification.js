const express = require("express"); 
const router = express.Router();


const Order = require("../models/order");
const Vendor = require("../models/vendor");
const middlewareObj = require('../middleware');

router.get("/notification", middlewareObj.isLoggedIn, async (req, res) => {
    if(req.session.strategy === "customerLocal"){
        Order.find({customer: req.session.currentUser._id}).populate("store").sort({createdAt: -1}).exec((err, customerOrders) => {
            if(err){
                console.log(err);
            }
            else{
                res.render("notification", {orders: customerOrders});
            }
        })
    }
    
    else if(req.session.strategy === "vendorLocal"){
        var vendor = await Vendor.findById(req.session.currentUser._id);
        var vendorStore = vendor.store;
        Order.find({store: vendorStore}).populate("customer").sort({createdAt: -1}).exec((err, vendorOrders) =>{
            if(err){
                console.log(err);
            }
            else{
                res.render("notification", {orders: vendorOrders});
            }
        })
    }
    else{
        req.flash("error", "There is something wrong!");
        req.redirect("/");
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

router.post("/notification/:order_id/accept", (req, res) => {
    Order.findByIdAndUpdate(
        req.params.order_id, 
        {isConfirmed: true},
        (err, updatedOrder) => {
            req.flash("success", "Order accepted");
            res.redirect("/notification");
        }
    )
})

module.exports = router;
  