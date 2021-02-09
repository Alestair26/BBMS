var mongoose =require("mongoose");

var receiverSchema = new mongoose.Schema({
    username: String,
    request:[
        {
            username: String,
            bloodGroup: String,
            quantity: String,
            till_date: Date,
            status:String
        }
    ]
});

module.exports = mongoose.model("receiver",receiverSchema);