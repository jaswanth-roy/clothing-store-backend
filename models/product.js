const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({

    
    name: {
        type: String,
        required: [true,'please enter the name of the product'],
        trim: true,
        maxlength: [120,'product name show not be be more than 50 characters']

    },
    price: {
        type: Number,
        required: [true,'please enter the price of the product'],
        maxlength: [5,'product price show not be be more than 5 characters']
    },
    description: {
        type: String,
        required: [true,'please enter the description of the product'],
    
    },
   photos:[
         {
            id: {
                type: String,
                required: true,
               
            },
            secure_url: {
                type: String,
                required: true,

            }
        }
   ],
   category: {

        type: String,
        required: [true,'please enter the category of the product for short_sleves ,long_sleeves ,sweat_sleeves,hoodies ,etc'],   
        enum: {
            values:[
                'short_sleeves',
                'long_sleeves',
                'sweat_sleeves',
                'hoodies',
                

            ],
            message: 'please select the category ONLY from the short_sleeves ,long_sleeves ,sweat_sleeves,hoodies ,etc-',

        }, 

    },
    
        brand: {
            type: String,
            required: [true,'please enter the brand of the product'],

    },
    ratings: {
        type: Number,
        default: 0,

    },
    numberOfReviews: {
        type: Number,
        default: 0,

    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true,

            },
            name: {
                type: String,
                required: true,

            },
            rating: {
                type: Number,
                required: true,

            },
            comment: {
                type: String,
                required: true,

            },
        }


    


    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type:Date,
        default: Date.now(),
    },
});




    










module.exports = mongoose.model('Product', productSchema);

