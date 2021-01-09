const express = require("express"); 
const router = express.Router();
const Store = require("../models/store");
const Cart = require("../models/cart");
const Order = require("../models/order");
const Vendor = require("../models/vendor");


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
  
    console.log("REQ SESSION CURRENT USER IN CHECKOUT:" + req.session.currentUser);
    var cart = new Cart(req.session.cart);

    //Store which sells the items in the cart
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

router.get("/orders/:id", async (req, res) => {
    //Get orders from an customer sorted by latest datetime
    if(req.session.strategy === "customerLocal"){
      Order.find({customer: req.params.id}).populate("store").sort({createdAt: -1}).exec((err, customerOrders) => {
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
      Order.find({store: vendorStore}).populate("customer").sort({createdAt: -1}).exec((err, vendorOrders) =>{
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
  
/* 
router.get('/viewCustomerOrder', (req, res)=>
{
  Order.find({}, (err, takeOrder) =>
   {
            if(err){
                console.log(err);
                //res.redirect("/");
            }
            else{
                res.render("orderVendor", {orders: takeOrder});
            }
   })
})
 */


// router.get("/Rate", (req, res) => {
//   Order.find({customer: req.params.id}).populate("store").exec((err, customerOrders) => {
//       if(err){
//           console.log(err);
//       }
//       else{
//           res.render("Rate.ejs", {customerOrders: customerOrders});
//       }
//   })


// })

  
  
module.exports = router;
  