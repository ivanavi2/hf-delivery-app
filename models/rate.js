const mongoose = require("mongoose");


var ratingSchema = mongoose.Schema({

    rating: String,


    
});


module.exports = mongoose.model("Rate", ratingSchema);