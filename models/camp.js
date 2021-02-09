var mongoose = require("mongoose");

var campSchema = new mongoose.Schema({
    place: String,
    district: String,
    state: String,
    date: Date
});

module.exports = mongoose.model("Camp",campSchema);