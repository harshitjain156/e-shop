const express = require('express');

const router = express.Router();
const productModel=require('../models/product')
const cartModel=require('../models/cart')

// const caculateItemsSalesTax = items => {
//     // const taxRate = taxConfig.stateTaxRate;
  
//     const products = items.map(item => {
//       item.priceWithTax = 0;
//       item.totalPrice = 0;
//       item.totalTax = 0;
//       item.purchasePrice = item.price;
  
//       const price = item.purchasePrice;
//       const quantity = item.quantity;
//       item.totalPrice = parseFloat(Number((price * quantity).toFixed(2)));
  
//       if (item.taxable) {
//         const taxAmount = price * (taxRate / 100) * 100;
  
//         item.totalTax = parseFloat(Number((taxAmount * quantity).toFixed(2)));
//         item.priceWithTax = parseFloat(
//           Number((item.totalPrice + item.totalTax).toFixed(2))
//         );
//       }
  
//       return item;
//     });
  
//     return products;
//   };

router.get('/mycart/:userId',async (req,res)=>{

     try {
        let userId = req.params.userId
    

        // let checkUserId = await userModel.findById(userId)
        // if (!checkUserId) return res.status(404).send({ status: false, message: "UserId Do Not Exits" })

        let checkCart = await cartModel.findOne({'userId': userId }).populate({
            path: "items",
            populate: {
                path: 'productId',
                select: { 'name': 1, "price": 1, "image": 1,'desc':1 },
            }
        }).lean()
        if (!checkCart) return res.status(241).send({ status: false, message: "no-cart" })

        let itemsLength = checkCart.items.length

        if (itemsLength == 0) return res.status(241).send({ status: false, message: "no-cart" })

        return res.status(200).send({ status: true, toatalItems: itemsLength, message: "Success", data: checkCart })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
})
router.post('/add', async (req, res) => {
    try {
       
       

        
        let { productId, cartId,userId } = req.body
        // if (!keyValid(req.body)) return res.status(400).send({ status: false, message: "Insert Data : BAD REQUEST" })

        // if (!isValid(productId)) return res.status(400).send({ status: false, message: "Please Provide ProductId" })
        // if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Invalid ProductId" })
        let checkProduct = await productModel.findOne({ _id: productId })
        // if (!checkProduct) return res.status(404).send({ status: false, message: "Product Do Not Exists or DELETED" })

        let checkCart = await cartModel.findOne({ 'userId':userId })

        if (checkCart) {
            // if (!isValid(cartId)) return res.status(400).send({ status: false, message: "Please Provide cartId" })
            // if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "Invalid cartId" })
            // if (checkCart._id != cartId) return res.status(403).send({ status: false, message: "you are not authorized for this cartId" })

            let arr2 = checkCart.items

            let productAdded = {
                productId: productId,
                quantity: 1
            }

            let compareProductId = arr2.findIndex((obj) => obj.productId == productId)

            if (compareProductId == -1) arr2.push(productAdded)
            else arr2[compareProductId].quantity += 1

            let totalPriceUpdated = checkCart.totalPrice + (checkProduct.price)

            let totalItemsUpdated = arr2.length

            let productAdd = {
                items: arr2,
                totalPrice: totalPriceUpdated,
                totalItems: totalItemsUpdated
            }
            let updatedData = await cartModel.findOneAndUpdate({ userId: userId }, productAdd, { new: true })
            return res.status(201).send({ status: true, message: "Success", data: updatedData })
        }
        let arr1 = []

        let products = {
            productId: productId,
            quantity: 1
        }
        arr1.push(products)

        let totalPriceCalculated = checkProduct.price * products.quantity

        let productAdd = {
            userId: userId,
            items: arr1,
            totalPrice: totalPriceCalculated,
            totalItems: 1
        }
        let createdData = await cartModel.create(productAdd)
        return res.status(201).send({ status: true, message: "Success", data: createdData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }


  });
  module.exports = router;