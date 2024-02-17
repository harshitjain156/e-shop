const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId


const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            
            required: true,
            unique: true,
            trim: true
        },
        items: [{
                productId: {
                    type: ObjectId,
                    ref: "Products",
                    required: true,
                    trim: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    trim: true
                },
                _id:false
            }],
        totalPrice: {
            type: Number,
            required: true,
            trim: true
        },
        totalItems: {
            type: Number,
            required: true,
            trim: true
        },
    }, { timestamps: true });


module.exports = mongoose.model("Carts", cartSchema);