var mongoose = require("mongoose");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var Admin = require("./models/admin");
var Camp = require("./models/camp");
var User = require("./models/user");
var donor = require("./models/donor");
var Donation = require("./models/donation");
var receiver = require("./models/receiver");
var portNo = "3000";
var portId = "127.0.0.1";

mongoose.connect("mongodb://localhost:27017/project", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));

//======landing page =====//
app.get("/",function(req,res){
    res.render("landing");
});
//======home page =======//
app.get("/home",function(req,res){
    res.render("home");
});

//======== donor logic ========//
app.get("/donor/:donor_id/register",function(req,res){
    donor.findById(req.params.donor_id, function(err,foundDonor){
        if(err){
            console.log(err);
        }
        else{
            res.render("camp_register",{donor:foundDonor});
        }
    });
});

app.post("/donor/:donor_id/register",function(req,res){
    var bloodGroup = req.body.bloodGroup;var username = req.body.username;
    var camp = req.body.camp; var date = req.body.date; var quantity = req.body.quantity;
    var status = "pending";
    var donation = {username:username,bloodGroup:bloodGroup,camp: camp, quantity: quantity, date: date, status:status};
    donor.find({username:username},function(err,foundDonor){
        if(err){
            console.log(err);
        }else{
            Donation.create(donation,function(err,newDonation){
                if(err){
                    console.log(err);
                }else{
                    res.redirect("/donor/"+ req.params.donor_id + "/donations");
                }
            });
        }
    });
});

app.get("/donor/:donor_id/donations",function(req,res){
    donor.findById(req.params.donor_id, function(err,foundDonor){
        if(err){
            console.log(err);
        }
        else{
            var username = foundDonor.username;
            Donation.find({username:username},function(err,foundDonation){
                if(err){
                    console.log(err);
                }else{
                    res.render("donations",{donations:foundDonation});
                }
            });
           
        }
    });
});

//======== admin logic ========//
app.get("/admin",function(req,res){
    res.render("admin");
});

app.get("/admin/view_donations",function(req,res){
    Donation.find({status:"pending"},function(err,foundDonation){
        if(err){
            console.log(err);
        }else{
            res.render("new_donations",{donations:foundDonation});
        }
    });
});

app.get("/admin/new_camps",function(req,res){
    res.render("new_camps");
});

app.post("/admin/new_camps",function(req,res){
    var place = req.body.place; var district = req.body.district;
    var state = req.body.state; var date = req.body.date;
    var newcamp ={place:place,district:district,state:state,date:date};
    Camp.create(newcamp,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/admin/new_camps");
        }
    })
});
//======== recepient logic ======//

app.get("/receiver/:receiver_id/register",function(req,res){
    receiver.findById(req.params.receiver_id,function(err,foundReceiver){
        if(err){
            console.log(err);
        }else{
            res.render("request",{receiver:foundReceiver});
        }
    })
});

app.post("/receiver/:receiver_id/register",function(req,res){
    var username = req.body.username; var bloodGroup = req.body.bloodGroup;
    var date = req.body.date; var quantity = req.body.quantity;
    var request = {username:username,bloodGroup:bloodGroup, quantity: quantity, till_date: date};
    receiver.findOne({username:username},function(err,foundReceiver){
        if(err){
            console.log(err);
        }else{
            foundReceiver.request.push(request);
            foundReceiver.save();
            res.redirect("/receiver/"+ foundReceiver.id +"/requests/self");
        }
    });
});

app.get("/receiver/:receiver_id/requests/self",function(req,res){
    var id = req.params.receiver_id;
    receiver.findById(id,function(err,foundReceiver){
        if(err){
            console.log(err);
        }else{
            res.render("requests2",{receiver:foundReceiver});
        }
    });
});


//======Login logic here =====//
app.get("/signup",function(req,res){
    res.render("signup");
});

app.post("/signup",function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var Cpassword = req.body.Cpassword;
    if(password === Cpassword){
        var user = {username:username, password:password};
        User.create(user,function(err,newUser){
            if(err){
                console.log(err);
            }else{
                res.redirect("/login");
            }
        })

    }else{
        console.log(err);
    }
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;
    var user = {username:username, password:password};
    if(role === "admin"){
        Admin.findOne(user,function(err,foundUser){
            if(err){
                console.log(err);
            }else{
                res.render("admin",{foundUser:foundUser});
            }
        });
    }else{
        User.findOne(user,function(err,foundUser){
            if(err){
                console.log(err);
            }else{
                foundUser.role = role;
                if(foundUser.role === "donor"){
                    var newDonor = {username:foundUser.username};
                    donor.create(newDonor,function(err,newdonor){
                        if(err){
                            console.log(err);
                        }else{
                            res.render("donor",{donor:newdonor});
                        }
                    });
                    
                }else if(foundUser.role === "recepient"){
                    var newReceiver = {username:foundUser.username};
                    receiver.create(newReceiver,function(err,newreceiver){
                        if(err){
                            console.log(err);
                        }else{
                            res.render("recepient",{receiver:newreceiver});
                        }
                    });
                }else{
                    console.log(err);
                }
            }
        });

    }
    
});

app.get("/logout",function(req,res){
    res.redirect("/login");
});



app.listen(portNo,portId,function(){
    console.log("Server has started");
});