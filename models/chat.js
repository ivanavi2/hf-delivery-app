var mongoose = require("mongoose");


var chatSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
    },
    messages: [
        {
            name: String,
            message: String,
            time: {
                type: Date,
                default: Date.now,
            }
        }
    ]
})

module.exports = mongoose.model("Chat", chatSchema);