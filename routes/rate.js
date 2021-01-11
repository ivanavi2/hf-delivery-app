const express = require("express"); 
const router = express.Router();
const Order = require("../models/order");
const Vendor = require("../models/vendor");

const middlewareObj = require('../middleware');


router.get("/Rate",(req, res) => {
    
        Order.find({customer: req.session.currentUser._id}).populate("store").sort({createdAt: -1}).exec((err, customerOrders) => {
            if(err){
                console.log(err);
            }
            else{
                res.render("Rate", {orders: customerOrders});
            }
        })
})
router.post("/Rate", (req, res) => {
    
        console.log("Req.body " + req.body);
        console.log("Req.body.rate " + [req.body.rate]);
        // const rate = new Rating(req.body);


        // rate.save()
        // .then((result)=>{
        //     res.redirect('/Rate');
        // })
        // .catch((err)=> {
        //     console.log(err)
        // })



})


module.exports = router;
