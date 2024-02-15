const express = require('express');

const router = express.Router();

const checkAuth=require('../middleware/check-auth')
const orderController =require( '../controllers/order')


router.get('/',checkAuth,orderController.orders_get_all)


router.post('/', checkAuth,orderController.add_new_order);


router.get('/:orderId',checkAuth,orderController.get_order);

router.delete('/:orderId', checkAuth,orderController.delete_order);
module.exports = router;