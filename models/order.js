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
    deliveryAddress: String,
    deliveryBlockUnit: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isDelivered: String, //Status: preparing, packaging, arriving and delivered update from seller
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    isCancelled: {
        type: Boolean,
        default: false,
    }

});

module.exports = mongoose.model("Order", orderSchema);