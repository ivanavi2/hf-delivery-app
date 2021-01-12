const express = require("express"); 
const router = express.Router();
const Order = require("../models/order");
const Vendor = require("../models/vendor");
const Store = require("../models/store");

const middlewareObj = require('../middleware');


router.get("/orders/rate/:order_id", middlewareObj.isLoggedIn, (req, res) => {
    
        Order.findById(req.params.order_id).populate("store").exec((err, foundOrder) => {
            if(err){
                console.log(err);
            }
            else{
                res.render("rate", {foundOrder: foundOrder});
            }
        })
})

router.post("/orders/rate/:order_id", middlewareObj.isLoggedIn, async (req, res) => {
    
  var rating = parseInt(req.body.rating);

  //Retrieve order from database and get store id from order
  var order = await Order.findById(req.params.order_id);
  var orderStoreID = order.store._id;

  //Retrieve seller store from order from database
  var orderStore =  await Store.findById(orderStoreID);

  //Number of ratings of the store
  var storeNumRating = orderStore.numRating;
  //console.log("NUMBER OF RATINGS" + storeNumRating);

  //Current rating of the store
  var currentStoreRating = orderStore.rating;
  //console.log("CURRENT RATING: " + currentStoreRating);

  //Calculate new average rating
  var newStoreRating = ((currentStoreRating*storeNumRating) + rating)/(storeNumRating + 1);
  //console.log("NEW RATING: " + newStoreRating);


  //set found order isRated to true, then update store rating and numRating
  await order.updateOne({isRated: true}, (err, updatedOrder) => {
    if(err){
      req.flash("error", "Something went wrong!");
      res.redirect("back");
    }
    else{
        orderStore.updateOne(
        {
          $inc: {numRating: 1},
          rating: newStoreRating,
        },
        (err, updatedStore) => {
          if(err){
            req.flash("error", "Something went wrong!");
            res.redirect("back");
          }
          else{
            req.flash("success", "Thanks for rating");
            res.redirect("/");
          }
        }
      )
    }
  })
})


module.exports = router;
