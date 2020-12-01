const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema({

    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: "Store",
    },
    items: [
        {
            productId: String,
            qty: Number,
            price: Number,
            name: String,
            description: String,
            image: String,
        }
    ],
    totalQty: Number,
    totalPrice: Number,
    address: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model("Order", orderSchema);