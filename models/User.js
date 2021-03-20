const mongoose = require("mongoose")

const UserSchema=new mongoose.Schema({
    Ονοματεπώνυμο:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    Τμήμα_Αποφοίτησης:{
        type:String,
        required:true
    },
    Τίτλος_Διπλωματικής_Εργασίας:{
        type:String
    },
    Μεταπτυχιακός_Τίτλος_1:{
        type:String
    },
    Μεταπτυχιακός_Τίτλος_2:{
        type:String
    },
    Μεταπτυχιακός_Τίτλος_3:{
        type:String
    },
    Εργασιακή_Εμπειρία_1:{
        type:String
    },
    Εργασιακή_Εμπειρία_2:{
        type:String
    },
    Εργασιακή_Εμπειρία_3:{
        type:String
    },
    Περιοχή_Δραστηριοποίησης:{
        type:String
    },
    Τηλέφωνο:{
        type:Number
    },
    role:{
        type:String,
        default: "basic"
    },
    checked:{
        type:Boolean,
        default: false
    },
    email_verified:{
        type:Boolean,
        default: false
    },
    link:{
        type:String
    },
    Ημερομηνία_Εγγραφής:{
        type:Date,
        default: Date.now
    }
})

const User=mongoose.model('User',UserSchema)
module.exports=User;