var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var CustomerSchema = new mongoose.Schema({
    username: String,
    password: String,
    phone: String,
    email: String,
})

CustomerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Customer", CustomerSchema);