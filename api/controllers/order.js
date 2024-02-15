const Orders = require('../models/order');
const Product=require('../models/product');
const mongoose = require('mongoose');
const user = require('../models/user');





exports.orders_get_all= (req, res, next) => {
    Orders.find().select('quantity _id product userId').populate('product').exec()
    .then(docs => {
        const orders = docs.map(doc => {
            return {
                _id: doc._id,
                quantity: doc.quantity,
                product: doc.product,
                // request:{
                //     method:"GET",
                //     url:"http://localhost:3000/orders/"+doc._id
                // }
            };
        });
        res.status(200).json({
            
            count: orders.length,
            orders: orders,
            
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

}

exports.add_new_order=(req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            const order = new Orders({
                _id: new mongoose.Types.ObjectId(),
                userId:req.body.userId,
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: "Product added to cart",
                    data: result,
                    request: {
                        method: "GET",
                        url: "http://localhost:3000/orders/"+result._id
                    }
                });
                 // Add this line to exit the function after sending the response
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.get_order= (req, res, next) => {
    const id = req.params.orderId;
    Orders.findById(id).select('quantity product _id').populate('product').exec().then(
        doc=>{
            console.log(doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({
                message: "Invalid Id"
            });
        }
        })
}

exports.delete_order=(req, res, next) => {
    const id = req.params.orderId;
    Orders.deleteOne({_id: id})
    .exec()
    .then(result=>{
       
        res.status(200).json({
            message: 'Order Deleted'
        });
    })
    .catch(err=>{console.log(err);
        res.status(500).json({
            error:err
        });
    }); 
}