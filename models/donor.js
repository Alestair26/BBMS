var mongoose =require("mongoose");

var donorSchema = new mongoose.Schema({
    username: String,
    donations:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Donation"
        }
    ]
});

module.exports = mongoose.model("donor",donorSchema);