const express = require('express');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken')
const router=express.Router();
const bcrypt=require('bcryptjs')
require('dotenv').config();



const User=require('../models/user');
router.post('/signup',(req,res,next)=>{

   User.find({email:req.body.email}).exec()
   .then(result=>{
    if(result.length>1){
        return res.status(409).json({
            message:"user exist"
        })
    }else{
        bcrypt.hash(req.body.password,10,(err,hash)=>{
            console.log("kkk")
            if(err){
                return res.status(500).json({
                    error:"err"
                })
            }else{
                const user=new User({
                    _id:new mongoose.Types.ObjectId(),
                    email:req.body.email,
                    username:req.body.username,
                    password:hash
                })
                user.save()
                .then(result=>
                    {   console.log(result);
                        return res.status(201).json({
                            message:"user created",
                            user:result
                        })
                    })
                .catch(err=>{
                    console.log(err)
                    return res.status(500).json({
                        error:err
                    })
                })
            }
                
        })
    }
   })

   

   
})


router.post('/login',(req,res,next)=>{
    User.find({email:req.body.email}).exec()
    .then(user=>{
        if(user.length<1){
            return res.status(404).json({
                message:"user not found"
            })
        }else{
            bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
                if(err){
                    return res.status(404).json({
                        message:"Incorrect password"
                    });
                }
                if(result){
                    console.log(process.env.JWT)
                    const token=jwt.sign({
                        email:user[0].email,
                        userId:user[0]._id
                    },
                    process.env.JWT_TOKEN,{
                        expiresIn:"1h"
                    })
                    return res.status(200).json({
                        message:"Authentication Successful",
                        user:user[0],

                        token:token,
                        
                    })
                }
                res.status(404).json({
                    message:"Invalid user"
                })
            });
        }
    })
    .catch(err=>{console.log(err);
        res.status(500).json({
            error:err
        });
    });
})



router.delete('/:userId',(req,res,next)=>{
    User.deleteOne({_id:req.params.userId}).exec()
    .then(result=>{
        res.status(200).json({
            message: 'user Deleted'
        });
    })
    .catch(err=>{console.log(err);
        res.status(500).json({
            error:err
        });
    });   
})

module.exports=router;