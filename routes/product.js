const express = require('express');
const {addproduct,getAllProduct,adminGetAllProduct,getOneProduct,updateOneProduct,deleteOneProduct,addReview,deleteReview,getOnlyReviewsForOneProduct} = require('../controllers/productcontroller');
const router = express.Router();
const {isLoggedIn,customRole} = require('../middlewares/user');

//user routers
router.route("/products").get(getAllProduct);
router.route("/product/:id").get(getOneProduct);
router.route("/review").put(isLoggedIn,addReview);
router.route("/review").delete(isLoggedIn,deleteReview);
router.route("/reviews").get(isLoggedIn,getOnlyReviewsForOneProduct);



//admin routes

router.route("/admin/product/add").post(isLoggedIn,customRole('admin'),addproduct);

router.route("/admin/products").get(isLoggedIn,customRole('admin'),adminGetAllProduct);
router
.route("/admin/product/:id")
.put(isLoggedIn,customRole('admin'),updateOneProduct)
.delete(isLoggedIn,customRole('admin'),deleteOneProduct);















module.exports = router;