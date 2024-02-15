const express = require('express');
const mongoose=require('mongoose')
const Product=require('../models/product');
const multer=require('multer');
const productController=require('../controllers/product')
const checkAuth=require('../middleware/check-auth')
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads')
    },
    filename:function(req,file,cb){
        cb(null, new Date().getHours().toString()+file.originalname)
    }
})
const filefilter=(req,file,cb)=>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
        cb(null,true);
        
    } else {
        cb(null,false)
    }
}
const upload=multer({storage:storage,limits:{
    fileSize:1024*1024*10
    },
    fileFilter:filefilter

});



const router=express.Router();
router.get('/',productController.get_all_products)


router.post('/',checkAuth,upload.single('productImage'),productController.create_new_product)


// router.get('/:productId',productController.get_product)


router.patch('/:productId',productController.update_product);

router.delete('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    Product.deleteOne({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'Product Deleted'
        });
    })
    .catch(err=>{console.log(err);
        res.status(500).json({
            error:err
        });
    });       
});


// router.get('/search',async(req,res,next)=>{
//     // const location=req.body.location;
//     const tags="Book";
//     const name="book"
//     const query = Product.find();
//     // console.log(name)
//     // console.log(location);
 
//     // if (name) {
//     //     query.where('name').equals(name);
//     //   }
//     //   if(location){
//     //     query.where('pincode').equals(location);
//     //   }
//     if (name) {
//         query.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive search for name
//     }
//       if (1) {
//         // console.log(language)
//         query.where('name').in(tags.split(','));
//       }
//       const results = await query.exec();
//       console.log(results);
//       res.status(200).json({
//         message:"Handeling get request"
//         ,data:results})
 
//     // Provider.find({"pincode":location}).exec()
//     // .then(doc=>{
//     //     res.status(200).json({
//     //         message:"Handeling get request"
//     //         ,data:doc
//     //     })
//     // })
 
  
    
// })


router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;
        // const name="book";
        // Constructing the query object
        const query = {};

        // Add conditions to the query based on the request parameters
        if (name) {
            query.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive search for name
        }
        // if (minPrice && maxPrice) {
        //     query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }; // Range query for price
        // } else if (minPrice) {
        //     query.price = { $gte: parseFloat(minPrice) }; // Minimum price query
        // } else if (maxPrice) {
        //     query.price = { $lte: parseFloat(maxPrice) }; // Maximum price query
        // }
        // if (tags) {
        //     query.tags = { $in: tags.split(',') }; // Search for products with specified tags
        // }

        // Execute the query
        await Product.find(query).exec()
        .then(docs=>{
            const response={
                count: docs.length,
                products:docs.map(
                    doc=>{
                        return{
                            id:doc._id,
                            name:doc.name,
                            price:doc.price,
                            image:doc.image,
                            desc:doc.desc,
                            // request:{
                            //     method:"GET",
                            //     url:"http://localhost:3000/products/"+doc._id
                            // }
                        }
                    }
                )
            }
    
            res.status(200).json(response
            )
        });

        // Send the results as JSON response
        // res.status(200).json({ message: 'Product search successful', data: results });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get("/product/getproduct/",(req,res,next)=>{
     res.json("value");
})

module.exports=router;