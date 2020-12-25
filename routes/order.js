const express = require("express"); 
const router = express.Router();
const Store = require("../models/store");
const Cart = require("../models/cart");
const Order = require("../models/order");
const middlewareObj = require('../middleware');
const { collection } = require("../models/store");
const order = require("../models/order");


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
  

router.get('/viewCustomerOrder', (req, res)=>
{
  Order.find({}, (err, takeOrder) =>
   {
            if(err){
                console.log(err);
                //res.redirect("/");
            }
            else{
                res.render("viewCustomerOrder", {orders: takeOrder});
            }
   })
})



  
  
module.exports = router;
  