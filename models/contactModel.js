const mongoose = require('mongoose');
const schema = mongoose.Schema;
const contactSchema = schema({
    user_id : {
        type : schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    name : {
        type : String,
        required : [true , "Please add the contact name"]
    },
    email : {
        type : String,
        required : [true , "Please add the contact email"]
    },
    phone : {
        type : String,
        required : [true , "Please add the contact number"]
    },
    created_At : {
        type : Date,
        default : Date.now()
    }
})


const Contact = mongoose.model("Contact" , contactSchema);

module.exports = Contact;