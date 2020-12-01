const express = require("express"); 
const router = express.Router();
const Store = require("../models/store");
const Cart = require("../models/cart");
const Order = require("../models/order");
const middlewareObj = require('../middleware');


///////////////////CHECKOUT FROM CART////////////////////////////
router.post("/checkout", async (req, res) => {
    if(!req.session.cart){
      return res.redirect("back");
    }
  
    console.log("REQ SESSION CURRENT USER IN CHECKOUT:" + req.session.currentUser);
    var cart = new Cart(req.session.cart);

    //Store which the sells the items in the cart
    var store = await Store.findById(req.session.cartStoreId);
  
    var order = new Order({
      customer: req.session.currentUser,
      items: cart.getItems(),
      totalQty: cart.totalItems,
      totalPrice: cart.totalPrice,
      store: store,
    });
  
    console.log("IS ORDER STORE POPULATED?:" + order.populated(store));
    Order.create(order, (err, newOrder) => {
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/");
      }
    })
  
    req.session.cart = null;
    req.session.cartStoreId = null;
})

router.get("/orders/:id", (req, res) => {
    Order.find({customer: req.params.id}).populate("store").exec((err, customerOrders) => {
        if(err){
            console.log(err);
        }
        else{
            res.render("order.ejs", {customerOrders: customerOrders});
        }
    })


})
  
  
  
  module.exports = router;
  