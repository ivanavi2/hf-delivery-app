const express = require("express"); 
const router = express.Router();
const Store = require("../models/store");
const Cart = require("../models/cart");
const Order = require("../models/order");
const middlewareObj = require('../middleware');

//SHOW CART 
router.get("/cart", middlewareObj.isLoggedIn, (req, res) => {
    if (!req.session.cart) {
        return res.render('cart', {
          cartItems: null
        });
      }
      var cart = new Cart(req.session.cart);
      res.render('cart', {
        title: 'NodeJS Shopping Cart',
        cartStoreId: req.session.cartStoreId,
        cartItems: cart.getItems(),
        totalPrice: cart.totalPrice.toFixed(2),
        totalItems: cart.totalItems,
      });
})

//ADD PRODUCT TO CART
router.get("/stores/:store_id/add/:product_id", middlewareObj.isLoggedInCustomer, async (req, res) => {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    //cartStoreId = ID of the store selling items added to the cart **delete after checkout
    if(!req.session.cart){
        req.session.cartStoreId = req.params.store_id; 
    }

    if(req.session.cartStoreId != req.params.store_id){ 
      console.log("IN ADD PRODUCT"+req.session.cartStoreId + "---------------" + req.params.store_id);
      req.flash("error", "Please complete current order first before ordering from another store!");
      return res.redirect("/cart");        
    }        

    try {        
      let foundStoreMatchingProduct = await Store.findOne(
              {_id: req.params.store_id},
              {'products': {$elemMatch: {'_id': req.params.product_id}}});
      const product = foundStoreMatchingProduct.products[0];
      /*console.log("product added to cart:" + product);*/        
      cart.add(product);
      req.session.cart = cart;
      /*console.log("SESSION CART:" + cart.items[0]);
      console.log("SESSION CART ITEMS:" + req.session.cart.items); */
      res.redirect("/cart");
    }
    catch (error) {
      console.log(error.message);
      return res.redirect("/customer/" + req.session.currentUser._id);
    }
})

//DELETE PRODUCT IN CART - DECREMENT BY 1
router.get("/stores/:store_id/delete/:product_id", async (req, res) => {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  req.session.cart.storeId = req.params.store_id;

  try {
      let foundStoreMatchingProduct = await Store.findOne(
              {_id: req.params.store_id},
              {'products': {$elemMatch: {'_id': req.params.product_id}}});
      const product = foundStoreMatchingProduct.products[0];
    /*console.log("product removed by 1 in cart:" + product); */
      cart.remove(product);
      req.session.cart = cart;
      res.redirect("/cart");

  }
  catch (error) {
      console.log(error.message);
      res.redirect("/customer/" + req.session.currentUser._id);
  }
})





module.exports = router;
