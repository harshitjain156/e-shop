const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username:{type:String,},
    email:{type:String,
    match:/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
},
    password:{type:String,required:true}


})

module.exports=mongoose.model('users',userSchema);
