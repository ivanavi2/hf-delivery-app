
const express = require("express"); 
const app = express();

const router = express.Router();
const Store = require("../models/store");
const Chat = require("../models/chat");
const Cart = require("../models/cart");
const Order = require("../models/order");


const middlewareObj = require('../middleware');


//Render same template for now
router.get("/chat", middlewareObj.isLoggedIn, (req, res) => {
    
    //SHOW CHAT - CUSTOMER VIEW
    if(req.session.strategy === "customerLocal"){
/*         var custChats = Chat.find({customer:req.session.currentUser._id});
        console.log(custChats);
        res.redirect("/"); */
        Chat.find({customer: req.session.currentUser._id})
        .populate("store")
        .exec((err, custChats) => {
            if(err){
                console.log(err);
            }
            else{
                res.render("chat", {custChats: custChats});
            }
        })
    }

    if(req.session.strategy === "vendorLocal"){
/*         console.log("CHAT CURRENT USER VENDOR:" + req.session.currentUser.store);
        console.log("CHAT VENDOR STORE ID: " + req.session.currentUser.store._id); */
        Chat.find({store: req.session.currentUser.store})
        .populate("customer")
        .exec((err, vendorChats) => {
            if(err){
                console.log(err);
            }
            else{
                res.render("chat", {vendorChats: vendorChats});
            }
        })
    }
})


//Show chat with particular store
router.get("/chat/:store_id/:cust_id",middlewareObj.isLoggedIn, async (req, res) => {
    //Find chat between customer and that particular store
    if(req.session.strategy === "customerLocal"){
        var foundChat = await Chat.findOne(
            {
                customer: req.params.cust_id,
                store: req.params.store_id,
            }
        ).populate("store");    
    }

    if(req.session.strategy === "vendorLocal"){
        var foundChat = await Chat.findOne(
            {
                customer: req.params.cust_id,
                store: req.params.store_id,
            }
        ).populate("customer");    
    }

    if(!foundChat){
        console.log("CHAT NOT FOUND!!");
        var customer = req.session.currentUser;
        var store = await Store.findById(req.params.store_id);
        Chat.create({customer: customer, store: store}, (err, newChat) => {
            if(err){
                console.log(err);
            }
            else{
                console.log("IN NEW CHAT");
                res.render("showChat", {chat: newChat});
            }
        })
    }
    else{
/*         console.log("FOUND CHAT"); */
        res.render("showChat", {chat: foundChat});
    }

})

router.post("/chat/:store_id/:cust_id",middlewareObj.isLoggedIn, async (req, res) => {

    var message ;    
    if(req.session.strategy === "customerLocal"){
        message = {name:req.session.currentUser.username, message: req.body.message};       
    }

    if(req.session.strategy === "vendorLocal"){
        var store = await Store.findById(req.params.store_id);
        message = {name: store.name, message: req.body.message};
    }

    //Push message into chat if chat between customer and that particular store exist,
    //else create a new chat
    Chat.updateOne(
        {
            //customer: req.session.currentUser._id,
            customer: req.params.cust_id,
            store: req.params.store_id,
        },
        {
            $push: {messages: message}
        },
        {upsert: true},
        (err, updatedChat) =>{
            if(err){
                console.log(err)
            }
            else{
                res.redirect("/chat/" + req.params.store_id + "/" + req.params.cust_id);
            }
        }
    )
})




module.exports = router;