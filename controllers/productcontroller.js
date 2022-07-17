const Product = require('../models/product');
const Bigpromise=require('../middlewares/bigpromise');
const CustomError=require('../utils/customError');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const whereClause = require('../utils/whereClause');
const { validate } = require('../models/product');

exports.addproduct = Bigpromise(async (req, res, next) => {
    //images are stored in req.files
    let imageArray = [];
    if (!req.files) {
        return next(new CustomError('images are required', 400));
    }
    if (req.files){
        for(let i=0;i<req.files.photos.length;i++){
            let file = req.files.photos[i];
            let result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: "products",
                width: 300,
                crop: "scale"
            });
            imageArray.push({
                id: result.public_id,
                secure_url: result.secure_url
            });
        }

    }

    req.body.photos = imageArray;
    req.body.user=req.user.id;

    // crearte a new product
    const product= await Product.create(req.body);
    res.status(201).json({
        status: 'success',
        product,
    });




      

});

exports.getAllProduct = Bigpromise(async (req, res, next) => {
    const resultperPage=6;
    const totcountProducts=await Product.countDocuments();
    
    const productsObj = new whereClause(Product.find(),req.query).search().filter();
    let products = await productsObj.base;
    const filteredProducts =products.length;
    //products.limit().skip()
    productsObj.pager(resultperPage);
    products=await productsObj.base.clone();
    res.status(200).json({
        status: 'success',
        products,
        filteredProducts,
        totcountProducts
    });
});
//get one product
exports.getOneProduct = Bigpromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new CustomError('product not found', 404));
    }
    res.status(200).json({
        status: 'success',
        product,
    });
});
//add review to product
exports.addReview = Bigpromise(async (req, res, next) => {
    const {rating,comment,productId}=req.body;

    const review={
        user:req.user._id,
        name:req.user.name,
        rating:number(rating),
        comment,

    }
    const product=await Product.findById(productId);
    const AlreadyReviewed=product.reviews.find(review=>review.user.toString==req.user._id.toString);
    if(AlreadyReviewed){
       product.reviews.forEach(review=>{
              if(review.user.toString==req.user._id.toString){
                review.rating=rating;
                review.comment=comment;
              }
         }
         );
    }else{
    product.reviews.push(review);
    product.numberOfReviews=product.reviews.length; //number of reviews
    }
    // adjust the average rating
    product.ratings=product.reviews.reduce((acc,item)=>item.rating * acc,0 ) / product.reviews.length;
    await product.save({validateBeforeSave:false});
    res.status(200).json({
        status: 'success',
        product,

    });
    
    
    

    

    
});

//delete the reviews
exports.deleteReview = Bigpromise(async (req, res, next) => {
    const {productId}=req.query;
    const product=await Product.findById(productId);
    const reviews=product.reviews.filter(review=>review.user.toString!=req.user._id.toString);
    const numberOfReviews=reviews.length;
    product.ratings=product.reviews.reduce((acc,item)=>item.rating * acc,0 ) / product.reviews.length;
    // update the products
    await Product.findByIdAndUpdate(productId,{
        reviews,
        numberOfReviews,
        ratings,
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false

    });
    res.status(200).json({
        status: 'success',
        
    });
}
);
//get reviews of one product only
exports.getOnlyReviewsForOneProduct = Bigpromise(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        status: 'success',
        reviews:product.reviews,
    });
}
);







    


// //update products with photos
exports.updateOneProduct = Bigpromise(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new CustomError('product not found', 404));
    }
    let imageArray = [];
    if (req.files) {
        //destroy old images are stored in req.files
        for (let i = 0; i < req.files.photos.length; i++) {
            let file = req.files.photos[i];
            await cloudinary.v2.uploader.destroy(file.id);
        }
        //upload new images are stored in req.files
       
        for (let i = 0; i < req.files.photos.length; i++) {
            let file = req.files.photos[i];
            let result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: "products",
                width: 300,
                crop: "scale"
            });
            imageArray.push({
                id: result.public_id,
                secure_url: result.secure_url
            });
        }
        product.photos = imageArray;
    }
    req.body.photos = imageArray;

    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

        
    res.status(200).json({
        status: 'success',
        product,
    });
}
);
// delete one products
exports.deleteOneProduct = Bigpromise(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new CustomError('product not found', 404));
    }
    // destroy the existing images
    for (let i = 0; i < product.photos.length; i++) {
        await cloudinary.v2.uploader.destroy(product.photos[i].id);
    }
    await product.remove();
    //await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: 'success',
        message: 'product deleted successfully',
    });


}
);



exports.adminGetAllProduct = Bigpromise(async (req, res, next) => {
    const products = await Product.find();
    // if (!products) {
    //     return next(new CustomError('No products found', 404));
    // }
    res.status(200).json({
        status: 'success',
        products,
    });
}   
);

