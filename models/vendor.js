var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var VendorSchema = new mongoose.Schema({
    username: String,
    password: String,
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store"
    },
})

VendorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Vendor", VendorSchema);