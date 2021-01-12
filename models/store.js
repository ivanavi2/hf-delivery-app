var mongoose = require("mongoose");

var StoreSchema = new mongoose.Schema({
    name: String,
    products: [
        {
            name: String,
            price: Number,
            description: String,
            image: String,
        }
    ],
    rating: {
        type: Number,
        default: 0,
    },
    numRating: {
        type: Number,
        default: 0,
    },
    image: String,
})

module.exports = mongoose.model("Store", StoreSchema);