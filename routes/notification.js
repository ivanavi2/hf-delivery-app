const express = require("express"); 
const router = express.Router();

const Order = require("../models/order");
const Vendor = require("../models/vendor");

const middlewareObj = require('../middleware');

const nodemailer = require("nodemailer");

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

//CANCEL ORDER BY CUSTOMER
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

//ACCEPT ORDERS BY SELLER
router.post("/notification/:order_id/accept", (req, res) => {

    //Create nodemailer transporter object
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "guang@graduate.utm.my",
            pass: "ivantehteh1",
        },
    })

    Order.findByIdAndUpdate(req.params.order_id, {isConfirmed: true})
    .populate("customer")
    .exec((err, updatedOrder) => {
        //Send email using nodemailer
        var message = {
            from: "bizbuzbiz@hotmail.com",
            to: updatedOrder.customer.email,
            subject: "Order accepted",
            text: "Your order with order ID of " + updatedOrder._id + " has been accepted and while be delivered shortly!",
        }
        transporter.sendMail(message, (err, info) => {
            if(err){
                console.log(err);
            }
            else{
                console.log("Email sent");
            }
        })

        req.flash("success", "Order accepted");
        res.redirect("/notification");
    }
    )
})

module.exports = router;
  