const User=require('../models/User');
const Bigpromise=require('../middlewares/bigpromise');
const CustomError=require('../utils/customError');
const cookieToken=require('../utils/cookieToken');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');
const mailHelper = require('../utils/emailHelper');
const nodemailer = require("nodemailer");
const crypto =require('crypto');


exports.signup=Bigpromise(async (req,res,next)=>{
    //let result;
    if (!req.files) {
        return next(new CustomError('photo is required',400));
    };
    const {name,email,password}=req.body;
    if (!email || !name || !password) {
        return next(new CustomError('name or email is required',400));

    };
        
        let file = req.files.photo;
         result= await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder:"users",
            width:300,
            crop:"scale"
        });
    
    
    const user= await User.create({
        name,
        email,
        password,
        photo:{
            id:result.public_id,
            secure_url:result.secure_url
        },
    });
    

    cookieToken(user,res);

});
// login route
exports.login=Bigpromise(async (req,res,next)=>{
    const {email,password}=req.body;
    // check for pressence of password and email
    if (!email || !password) {
        return next(new CustomError('please provide a email and password',400));
    };
    // check for user existence
    const user= await User.findOne({email}).select("+password");

    if (!user) {
        return next(new CustomError('user does not exist',400));
    }
    // check for password
    const isMatch= await user.isvalidatedPassword(password);
    if (!isMatch) {
        return next(new CustomError('password is incorrect',400));
    }
    // generate token
    cookieToken(user,res);
});

// logout route
exports.logout=Bigpromise(async (req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });
    res.status(200).json({success:true,message:'logout successful'});


});

exports.forgotPassword=Bigpromise(async (req,res,next)=>{
    const {email}=req.body;
    if (!email) {
        return next(new CustomError('please provide a email',400));
    }
    const user= await User.findOne({email});
    if (!user) {
        return next(new CustomError('user does not exist',400));
    }
    const token=user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    const resetURL=`${req.protocol}://${req.get('host')}/password/reset/${token}`;
    const message=`Forgot your password? Submit a PATCH request with your new password and passwordConfirmation to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        await mailHelper({
            email:user.email,
            subject:'Your password reset token (valid for 10 minutes)',
            message
        });
        res.status(200).json({success:true,message:'token sent to email'});
    } catch (error) {
        user.forgotpasswordToken=undefined;
        user.forgotpasswordExpiry=undefined;
        await user.save({validateBeforeSave:false});
        return next(new CustomError(error.message,500));

    }
}
);

exports.passwordReset=Bigpromise(async (req,res,next)=>{
    //grab the token from the url
    const token=req.params.token;

    const encryToken=crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
    
    const user= await User.findOne({
       encryToken,
        forgotpasswordExpiry:{$gt:Date.now()}
    });
    if (!user) {
        return next(new CustomError('invalid token',400));
    }

    if(req.body.password!==req.body.passwordConfirmation){
        return next(new CustomError('password and passwordConfirmation must match',400));
    };

    user.password=req.body.password;
    user.forgotpasswordToken=undefined;
    user.forgotpasswordExpiry=undefined;
    await user.save();
    cookieToken(user,res);
    //res.status(200).json({success:true,message:'password updated'});
});

// Logged in user profile route
exports.getLoggedUser=Bigpromise(async (req,res,next)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({success:true,user});
}
);

//change password route
exports.changePassword=Bigpromise(async (req,res,next)=>{
    const userId = req.user.id;

    const user = await User.findById(userId).select("+password");
    const isMatch= await user.isvalidatedPassword(req.body.currentPassword);
    if (!isMatch) {
        return next(new CustomError('password is incorrect',400));
    }
    // if(req.body.password!==req.body.passwordConfirmation){
    //     return next(new CustomError('password and passwordConfirmation must match',400));
    // }
    user.password=req.body.password;
    await user.save();
    cookieToken(user,res);
   // res.status(200).json({success:true,message:'password updated'});
}
);

// update user profile route
exports.updateUser=Bigpromise(async (req,res,next)=>{
    

    


    const userId=req.user.id;
    const newData ={
        name:req.body.name,
        email:req.body.email,
        //photo:req.body.photo


    };
    if(req.files){
        const user=await User.findById(userId);
        const imageId=user.photo.id;
        // delete the old imageId
        const resp=await cloudinary.v2.uploader.destroy(imageId);
        // uploload new photo to cloudinary
        const result= await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
            folder:"users",
            width:300,
            crop:"scale"
        });
        newData.photo={
            id:result.public_id,
            secure_url:result.secure_url,

    }
    }

    const user= await User.findByIdAndUpdate(userId,newData,{new:true,runValidators:true,useFindAndModify:false});
    res.status(200).json({success:true,user});
}
);

// admin for all users route
exports.adminAllUsers=Bigpromise(async (req,res,next)=>{
    const users=await User.find({});
    res.status(200).json({success:true,users});
}
);

// admin for single user route
exports.adminSingleUser=Bigpromise(async (req,res,next)=>{
    const user=await User.findById(req.params.id);
    
    if(!user){
        return next(new CustomError('user does not exist',400));
    }
    res.status(200).json({success:true,user});
}
);

//update for single user route
exports.updateSingleUser=Bigpromise(async (req,res,next)=>{
    const userId=req.params.id;
    const newData ={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,

    };
    const user= await User.findByIdAndUpdate(req.params.id,newData,{new:true,runValidators:true,useFindAndModify:false});
    res.status(200).json({success:true,user});

}
);

//delete for single user route
exports.deleteSingleUser=Bigpromise(async (req,res,next)=>{
    
    const user= await User.findByIdAndDelete(req.params.id);
    if(!user){
        return next(new CustomError('user does not exist',400));
    }
    const imageId=user.photo.id;
    // delete the old imageId
    const resp=await cloudinary.v2.uploader.destroy(imageId);
    await user.remove();
    res.status(200).json({success:true,message:'user deleted'});

    res.status(200).json({success:true,user});


}
);






exports.managerAllUser=Bigpromise(async (req,res,next)=>{
    const users=await User.find({role:"user"});
    res.status(200).json({success:true,users});
}
);




