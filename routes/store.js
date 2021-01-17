const express = require("express"); 
const router = express.Router();
const Store = require("../models/store");

//Store routes (customer view)
//INDEX ROUTES - SHOW ALL STORES
router.get("/stores", (req, res) => {
    Store.find({}, (err, allStores) => {
        if(err){
            console.log(err);
            res.redirect("/");
        }
        else{
            res.render("stores", {stores: allStores});
        }
    })
})

//SHOW ROUTE - SHOW PARTICULAR STORE
router.get("/stores/:store_id", (req, res) => {
    Store.findById(req.params.store_id, (err, foundStore) => {
        if(err){
            console.log(err);
        }
        else{
            res.render("showStore", {store: foundStore});
        }
    })
})

//SEARCH STORE BY STORE NAME
router.get("/search", (req, res) => {
    Store.find(
        {$text: {$search: req.query.storeName}},
        {score: {$meta: "textScore"}},)
    .sort({score: {$meta: "textScore"}})
    .exec((err, foundStores) => {
        if(err){
            req.flash("error", "Error in searching stores!");
            console.log(err);
            console.log(req.query.storeName);
            res.redirect("/stores")
        }
        else{
            console.log(req.query.storeName);
            console.log(foundStores);
            res.render("storeSearchResult", {foundStores: foundStores});
        }
    })
})

module.exports = router;