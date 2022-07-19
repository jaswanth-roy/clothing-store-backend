const Order = require('../models/order');
const Product = require('../models/product');
const Bigpromise=require('../middlewares/bigpromise');

exports.createOrder = Bigpromise(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,


    }=req.body;
   const order=await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        user:req.user._id,
   });

   res.status(200).json({

         status:'success',
         order,
   });

});
//get one order item  by id   
exports.getOneOrder = Bigpromise(async (req, res, next) => {
    const order=await Order.findById(req.params.id).populate('user','name email');
    if(!order){
        return next(new CustomError('Order not found',404));
    }
        

    res.status(200).json({
        status:'success',
        order,
    });
}
);

// get logged in user orders
exports.getUserOrders = Bigpromise(async (req, res, next) => {
    const orders=await Order.find({user:req.user._id});
    if(!orders){
        return next(new CustomError('Orders not found',404));
    }
        

    res.status(200).json({
        status:'success',
        orders,
    });
}
);
// get admin orders
exports.getAdminOrders = Bigpromise(async (req, res, next) => {
    const orders=await Order.find({});
    if(!orders){
        return next(new CustomError('Orders not found',404));
    }
        

    res.status(200).json({
        status:'success',
        orders,
    });
}
);
//update admin order
exports.updateAdminOrder = Bigpromise(async (req, res, next) => {
    const order=await Order.findByIdAndUpdate(req.params.id);
    


    if(order.orderStatus==='Delivered'){
        return next(new CustomError('Order already delivered',400));
    }

    order.orderStatus=req.body.orderStatus;
    order.orderItems.forEach(async prod=>{
        await updateProductionStock(prod.product,prod.quantity);
    }
    );

    await order.save();
        

    res.status(200).json({
        status:'success',
        order,
    });
}
);

//admin delete order
exports.deleteAdminOrder = Bigpromise(async (req, res, next) => {
    const order=await Order.findByIdAndDelete(req.params.id);
    await order.remove();
    res.status(200).json({ status:'success',});
}
);

    
    


async function updateProductionStock(productId,quantity){
    const product=await Product.findById(productId);
    product.stock=product.stock-quantity;
    await product.save({validateBeforeSave:false});
}








    





