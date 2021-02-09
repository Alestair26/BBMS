var mongoose = require("mongoose");

var donationSchema = new mongoose.Schema({
    username:String,
    bloodGroup: String,
    camp: String,
    quantity: String,
    date: Date,
    status:String
});

module.exports = mongoose.model("Donation", donationSchema);