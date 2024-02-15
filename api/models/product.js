const mongoose=require('mongoose')

const productSchema=mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: {type:String},
    price:{type:Number},
    tags:{type:[String],default:["laptop","google","computer"]},
    desc:{type:String,default:''},
    image:{type: String,default:'https://picsum.photos/300/200'}

})

module.exports=mongoose.model('Products',productSchema);
