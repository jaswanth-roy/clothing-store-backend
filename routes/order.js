const express = require('express');
const {createOrder,getOneOrder,getUserOrders,getAdminOrders,updateAdminOrder,deleteAdminOrder} = require('../controllers/ordercontroller');
const router = express.Router();
const {isLoggedIn,customRole} = require('../middlewares/user');


router.route('/order/create').post(isLoggedIn,createOrder);
router.route('/order/:id').get(isLoggedIn,getOneOrder);
router.route('/myorder').get(isLoggedIn,getUserOrders);
//admin routes
router
.route('/admin/orders')
.get(isLoggedIn,customRole("admin"),getAdminOrders);
router.route('/admin/order/:id').put(isLoggedIn,customRole("admin"),updateAdminOrder);
router.route('/admin/order/:id').delete(isLoggedIn,customRole("admin"),deleteAdminOrder);

module.exports = router;
