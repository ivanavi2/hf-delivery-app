const express = require("express"); 
const router = express.Router();
const Vendor = require("../models/vendor");
const Store = require("../models/store");

//Vendor routes

//INDEX ROUTE - SHOW VENDOR ROUTE
router.get("/vendor/:id", (req, res) => {
    Vendor.findById(req.params.id).populate("store").exec((err, foundVendor) => {
        if(err){
            console.log(err);
        }
        else{
/*             console.log("MY RES LOCALS IS: " + res.locals.currentUser._id);
            console.log(foundVendor.username); */
            res.render("vendorMenu", {vendor: foundVendor});         
        }
    })
})


//STORE NEW ROUTE - SHOW SET UP STORE FORM
router.get("/vendor/:id/store", (req, res) => {
    res.render("addStore");
})

//STORE CREATE ROUTE - ADD STORE TO DATABASE 
router.post("/vendor/:id/store", (req, res) => {
    Vendor.findById(req.params.id, (err, foundVendor) => {
        if(err){
            console.log(err);
            res.redirect("/");
        }
        else{
            Store.create(req.body.store, (err, createdStore) => {
                foundVendor.store = createdStore;
                foundVendor.save();
                res.redirect("/vendor/" + req.params.id);
            })
        }
    })
})

//EDIT STORE ROUTE
///////////////////

//PRODUCTS//
//PRODUCT CREATE FORM 
router.get("/vendor/:id/store/:store_id", (req, res) => {
    Store.findById(req.params.store_id, (err, foundStore) => {
        if(err){
            console.log(err);
        }
        else{
            res.render("addProduct", {foundStore: foundStore});
        }
    })
})

//PRODUCT CREATE ROUTE - ADD PRODUCT UNDER STORE IN DATABASE
router.post("/vendor/:id/store/:store_id", (req, res) => {
    Store.findById(req.params.store_id, (err, foundStore) => {
        if(err){
            console.log(err);
        }
        else{
            foundStore.products.push(req.body.product);
            foundStore.save();
            res.redirect("/vendor/" + req.params.id);
        }
    })
})

//PRODUCT DELETE ROUTE - DELETE PRODUCT FROM STORE
router.delete("/vendor/:id/store/:store_id/:product_id", (req, res) => {
    console.log("STORE ID IS: " + req.params.store_id);

    Store.updateOne(
        {_id: req.params.store_id},
        {$pull: {'products': {'_id': req.params.product_id}}},
        {multi: true},
        (err, updatedStore) =>{
            if(err){
                console.log(err);
            }
            else{
                console.log("updated:" + updatedStore);
                res.redirect("/vendor/" + req.params.id);
            }
        })
})

//PRODUCT EDIT ROUTE - SHOW EDIT FORM (FIND STORE ELEMENT MATCHING WITH PRODUCT ID )
router.get("/vendor/:id/store/:store_id/:product_id", (req, res) => {
    Store.findOne(
        {_id: req.params.store_id},
        {'products': {$elemMatch: {'_id': req.params.product_id}}},
        (err, foundStoreMatchingProduct) => {
            if(err){
                console.log(err);
            }
            else{
                console.log("FOUND STORE EDIT PRODUCT!!!");
                console.log(foundStoreMatchingProduct);
                res.render("editProduct", {storeMatchingProduct: foundStoreMatchingProduct});
            }
        }
    )

})

//PRODUCT UPDATE ROUTE - UPDATE PRODUCT TO DATABASE
router.put("/vendor/:id/store/:store_id/:product_id", (req, res) => {
    var productNameQuery = req.params.product_name;

    Store.updateOne(
        {_id: req.params.store_id, 'products._id': req.params.product_id},
        {$set: {'products.$': req.body.product}},
        (err, updatedStore) => {
            if(err){
                console.log(err);
            }
            else{
                res.redirect("/vendor/" + req.params.id);
            }
        }
    )
})


module.exports = router;
