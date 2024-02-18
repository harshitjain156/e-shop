const express = require('express');

const router = express.Router();

const cartModel = require("../models/cart")
const productModel = require("../models/product");
const cart = require('../models/cart');


router.get('/mycart/:userId',async (req, res) => {
    try {
        let userId = req.params.userId;

        //checking if the cart exist with this userId or not
        let findCart = await cartModel.findOne({ userId: userId }).populate('items.productId');
        if (!findCart) return res.status(241).send({ status: false, message: `No cart found with this "${userId}" userId` });

        res.status(200).send({ status: true, message: "Success", data: findCart })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
})


router.post('/add', async function (req, res) {
    try {
        let data = req.body
        let userId = data.userId
        let cartId = data.cartId
        let productId = data.productId

        // if (validation.isValidBody(data)) return res.status(400).send({ status: false, message: "Please provide the input data" })

        // if (!validation.isValid(productId)) return res.status(400).send({ status: false, message: "Enter the productId" })

        // if (!validation.isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Enter a valid productId" })

        let findProduct = await productModel.findById(productId)
        if (!findProduct) return res.status(404).send({ status: false, message: "productId is not found" })
        // if (findProduct.isDeleted == true) return res.status(404).send({ status: false, message: "productId is deleted" })
        let price = findProduct.price
        let findCartIdByUserId = await cartModel.findOne({userId:userId})
        // cartId=findCartIdByUserId._id
        console.log(cartId);

        if (cartId) {
            // if (!validation.isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "Enter a valid cartId" })

            let findCart = await cartModel.findById(cartId)
            if (!findCart) return res.status(404).send({ status: false, message: "cartId is not found" })
            if (findCart.userId != userId) return res.status(400).send({ status: false, message: "This cart doesnot belongs to your account" })
                console.log(findCart)
            let itemsArr = findCart.items
            let totalPrice = findCart.totalPrice
            let totalItems = findCart.totalItems

            let flag = true

            for (i = 0; i < itemsArr.length; i++) {
                if (itemsArr[i].productId._id == productId) {
                    itemsArr[i].quantity += 1
                    totalPrice += price
                    flag = false
                }
            }

            if (flag == true) {
                itemsArr.push({ productId: productId, quantity: 1 })
                totalPrice += price
                totalItems += 1
            }
            const updatedCart = await cartModel.findOneAndUpdate({ _id: cartId }, ({ items: itemsArr, totalPrice: totalPrice, totalItems: totalItems }), { new: true }).select({ __v: 0 })
            return res.status(201).send({ status: true, message: "Success", data: updatedCart })
        }
        if (!cartId) {
            let findCartByUser = await cartModel.findOne({userId:userId})
            console.log(findCartByUser);
            if (findCartByUser) {
                let cartId = findCartByUser._id
                let itemsArr = findCartByUser.items
                let totalPrice = findCartByUser.totalPrice
                let totalItems = findCartByUser.totalItems
                console.log(findCartByUser);
                let flag = true

                for (i = 0; i < itemsArr.length; i++) {
                    if (itemsArr[i].productId._id == productId) {
                        itemsArr[i].quantity += 1
                        totalPrice += price
                        flag = false
                    }
                }''

                if (flag == true) {
                    itemsArr.push({ productId: productId, quantity: 1 })
                    totalPrice += price
                    totalItems += 1
                }
                const updatedCart = await cartModel.findOneAndUpdate({ _id: cartId }, ({ items: itemsArr, totalPrice: totalPrice, totalItems: totalItems }), { new: true }).select({ __v: 0 })
                return res.status(201).send({ status: true, message: "Success", data: updatedCart })
            } else if (!findCartByUser) {
                let items = [{ productId, quantity: 1 }]
                console.log(price)
                let obj = {
                    userId: userId,
                    items: items,
                    totalPrice: price,
                    totalItems: 1
                }

                const cartCreated = await cartModel.create(obj)
                return res.status(201).send({ status: true, message: "Success", data: cartCreated })
            }


        }

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}
);



router.put('/:userId/update',async function (req, res) {
    try {
        const data = req.body
        let cartId = data.cartId
        const productId = data.productId
        const removeProduct = data.removeProduct
        const userId = req.params.userId
        let findCartIdByUserId = await cartModel.findOne({userId:userId})
        cartId=findCartIdByUserId._id

        // if (validation.isValidBody(data)) return res.status(400).send({ status: false, message: "Please provide the input data" })

        // if (!validation.isValid(productId)) return res.status(400).send({ status: false, message: "Enter the productId" })

        // if (!validation.isValid(cartId)) return res.status(400).send({ status: false, message: "Enter the cartId" })

        // if (!validation.isValid(removeProduct)) return res.status(400).send({ status: false, message: "Enter the removeProduct" })

        if (!(removeProduct == 0 || 1)) return res.status(400).send({ status: false, message: "please set removeProduct to 1 to decrease poduct quantity by 1, or set to 0 to remove product completely from the cart" })

        // if (!validation.isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "Enter a valid cartId" })
        let findCart = await cartModel.findById(cartId)
        if (!findCart) return res.status(404).send({ status: false, message: "cartId is not found" })

        if (findCart.userId.toString() != userId) return res.status(400).send({ status: false, message: "This cart doesnot belongs to your account" })

        // if (!validation.isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Enter a valid productId" })
        let findProduct = await productModel.findById(productId)
        if (!findProduct) return res.status(404).send({ status: false, message: "productId is not found" })
        // if (findProduct.isDeleted == true) return res.status(404).send({ status: false, message: "productId is deleted" })
        let price = findProduct.price

        let itemsArr = findCart.items
        let totalPrice = findCart.totalPrice
        let totalItems = findCart.totalItems

        if (removeProduct == 1) {


            let flag = true

            for (i = 0; i < itemsArr.length; i++) {
                if (itemsArr[i].productId._id == productId) {
                    if (itemsArr[i].quantity > 1) {
                        itemsArr[i].quantity -= 1
                        totalPrice -= price
                        flag = false
                    } else if (itemsArr[i].quantity = 1) {
                        totalPrice -= price
                        totalItems--
                        itemsArr.splice(i, 1)
                        flag = false
                    }
                }
            }
            if (flag == true) {
                return res.status(400).send({ status: false, message: "Product is not in the cart" })
            }
            const updatedCart = await cartModel.findOneAndUpdate({ _id: cartId }, ({ items: itemsArr, totalPrice: totalPrice, totalItems: totalItems }), { new: true }).select({ __v: 0 })
            res.status(200).send({ status: true, message: "Success", data: updatedCart })


        }


        if (removeProduct == 0) {
            let flag = true

            for (i = 0; i < itemsArr.length; i++) {
                if (itemsArr[i].productId._id == productId) {
                    totalPrice -= (itemsArr[i].quantity) * price
                    totalItems--
                    itemsArr.splice(i, 1)
                    flag = false
                }
            }
            if (flag == true) {
                return res.status(400).send({ status: false, message: "Product is not in the cart" })
            }

            const updatedCart = await cartModel.findOneAndUpdate({ _id: cartId }, ({ items: itemsArr, totalPrice: totalPrice, totalItems: totalItems }), { new: true }).select({ __v: 0 })
            res.status(200).send({ status: true, message: "Success", data: updatedCart })
        }


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
)

module.exports=router;