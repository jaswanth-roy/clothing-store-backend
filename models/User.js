const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'please provide a name'],
        maxLength:[50,'name must be under 50 characters']
    },
    email:{
        type: String,
        required: [true,'please provide a email address'],
        validate:[validator.isEmail,'please provide a valid email address'],
        unique:true,
       
    },
    password:{
        type: String,
        required: [true,'please provide a password'],
        minlength:[8,'password must be at least 8 characters long'],
        select:false,
       
    },
    role:{
        type: String,
        default:'user'  
    },
    photo:{
        id:{
            type: String,
            required: true,
        },
        secure_url:{
            type: String,
            required: true,
       
    },
},

    forgotpasswordToken: String,
    forgotpasswordExpiry: Date,
    createdAt:{
        type:Date,
        default:Date.now,
    },
});

// encrypt password before save-hooks
userSchema.pre('save',async function (next){
    if(!this.isModified('password')) {
        return next();
    };
    this.password = await bcrypt.hash(this.password,10);
});

//validate the password with passsed on user password
userSchema.methods.isvalidatedPassword = async function(usersendPassword){
    return await bcrypt.compare(usersendPassword,this.password);
};

// generate token for userSchema
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRY,
    });
};


    


//genarate forgot password token(string)
userSchema.methods.getResetPasswordToken = function(){
    //generate a long random string
    const forgotToken = crypto.randomBytes(20).toString('hex');
    //hash the token-make sure to get a hash of the token
    this.forgotToken=crypto.createHash('sha256').update(forgotToken).digest('hex');
    //set the expiry date
    this.forgotpasswordExpiry = Date.now() + 10*60*1000;
    //return the token
    return forgotToken;


};


module.exports= mongoose.model("User",userSchema);
 

