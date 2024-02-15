const express =require('express');
const app=express();
const morgan=require('morgan')
const bodyParser=require('body-parser');
const mongoose=require('mongoose')

const productRoutes=require('./api/routes/product');
const orderRoutes=require('./api/routes/order');
const userRoutes=require('./api/routes/user');

// mongoose.connect("mongodb+srv://harshit:"+ process.env.MONGO_CODE+"@node-api.zoehoyl.mongodb.net/?retryWrites=true&w=majority",{
// })


// mongoose.connect("mongodb+srv://root:"+ process.env.MONGO_CODE+"@cluster0.3mzwldy.mongodb.net/?retryWrites=true&w=majority",{
// })

mongoose.connect("mongodb+srv://shivanis:LGnKDLqr8AK1z50M@cluster0.bddbnlp.mongodb.net/ecommerse?retryWrites=true&w=majority",{
})

mongoose.Promise=global.Promise;
app.use('/uploads',express.static('uploads'))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({h:"11"});
    }
    next();
})

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);
app.use((req,res,next)=>{
    const error=new Error('not found');
    error.status=404 ;
    next(error)
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})
module.exports=app;