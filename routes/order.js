const express = require("express"); 
const router = express.Router();
const Store = require("../models/store");
const Cart = require("../models/cart");
const Order = require("../models/order");
const Vendor = require("../models/vendor");

const middlewareObj = require("../middleware");


///////////////////CHECKOUT FROM CART////////////////////////////
router.get("/checkout", async (req, res) => {

  var cart = new Cart(req.session.cart);

  var cartStore = await Store.findById(req.session.cartStoreId);

  res.render('checkout', {
    title: 'NodeJS Shopping Cart',
    cartStore: cartStore,
    cartStoreId: req.session.cartStoreId,
    cartItems: cart.getItems(),
    totalPrice: cart.totalPrice.toFixed(2),
    totalItems: cart.totalItems,
  });
})

router.post("/checkout", async (req, res) => {
    if(!req.session.cart){
      return res.redirect("back");
    }
  
   // console.log("REQ SESSION CURRENT USER IN CHECKOUT:" + req.session.currentUser);
    var cart = new Cart(req.session.cart);

    //Store which sells the items in the cart
    var store = await Store.findById(req.session.cartStoreId);
  
    var order = new Order({
      customer: req.session.currentUser,
      items: cart.getItems(),
      totalQty: cart.totalItems,
      totalPrice: cart.totalPrice,
      deliveryAddress: req.body.deliveryAddress,
      deliveryBlockUnit: req.body.deliveryBlockUnit,
      store: store,
    });
  
    //console.log("IS ORDER STORE POPULATED?:" + order.populated(store));
    Order.create(order, (err, newOrder) => {
      if(err){
        console.log(err);
      }
      else{
        req.flash("success", "Order successfully placed");
        res.redirect("/");
      }
    })
  
    //Clear cart session variables
    req.session.cart = null;
    req.session.cartStoreId = null;
})

//SHOW ALL ORDERS BY CUSTOMER/SELLER
router.get("/orders/:id", async (req, res) => {
    //Get orders THAT IS NOT CANCELLED & ACCEPTED BY SELLER from an customer sorted by latest datetime
    if(req.session.strategy === "customerLocal"){
      Order.find({customer: req.params.id, isCancelled: false, isConfirmed: true}).populate("store").sort({createdAt: -1}).exec((err, customerOrders) => {
          if(err){
              console.log(err);
          }
          else{
              res.render("orderCustomer", {customerOrders: customerOrders});
          }
      })      
    }
    else if(req.session.strategy === "vendorLocal"){
      var vendor = await Vendor.findById(req.params.id);
      var vendorStore = vendor.store;
      Order.find({store: vendorStore, isCancelled: false, isConfirmed: true}).populate("customer").sort({createdAt: -1}).exec((err, vendorOrders) =>{
        if(err){
          console.log(err);
        }
        else{
          res.render("orderVendor", {vendorOrders: vendorOrders});
        }
      })
    }
    else{
      req.flash("error", "Error occured trying to view orders!");
      res.redirect("/");
    }
})

//SHOW UPDATE TRACKING STATUS PAGE FOR SELLER
router.get("/orders/updatetracking/:order_id", middlewareObj.isLoggedIn, (req, res) => {

  if(req.session.strategy === "customerLocal"){
    req.flash("error", "No permission");
    res.redirect("/");
  }

  Order.findById(req.params.order_id).populate("customer").exec((err, foundOrder) => {
    res.render("editTrackingInfoVendor", {foundOrder: foundOrder});
  })
})

router.post("/orders/updatetracking/:order_id", (req, res) => {
  Order.findByIdAndUpdate(req.params.order_id, {isDelivered: req.body.status}, (err, updatedOrder) => {
    if(err){
      console.log(err);
      req.flash("error", "Status update failed");
      res.redirect("back");
    }
    else{
      res.redirect("back");
    }
  })
})

//TRACK ORDER FOR CUSTOMER
router.get("/orders/tracking/:order_id", middlewareObj.isLoggedIn, (req, res) => {


  Order.findById(req.params.order_id).populate("store").exec((err, foundOrder) => {
    res.render("showTrackingInfoCust", {foundOrder: foundOrder});
  })
})

  
  
module.exports = router;
  