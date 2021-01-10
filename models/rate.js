const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var ratingSchema = mongoose.Schema({

    rating: String


    
});


module.exports = mongoose.model("Rating", ratingSchema);