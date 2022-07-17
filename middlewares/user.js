const User=require('../models/User');
const Bigpromise=require('../middlewares/bigpromise');
const CustomError=require('../utils/customError');
const jwt = require('jsonwebtoken');


exports.isLoggedIn=Bigpromise(async (req,res,next)=>{
    const token = req.cookies.token || req.header("Authorization").replace("Bearer ","");
    if (!token) {
        return next(new CustomError('please login',401));
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user= await User.findById(decoded.id);
    next();
});

exports.customRole= (...roles)=>{
    return (req,res,next)=>{
        if (!roles.includes(req.user.role)) {
            return next(new CustomError('you are not authorized',403));
        }
        next();
    }
};

    
