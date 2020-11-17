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
    image: String,
})

module.exports = mongoose.model("Store", StoreSchema);