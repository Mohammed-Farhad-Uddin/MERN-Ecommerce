const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Please Enter Product Name"],
        trim:true,
    },
    description:{
        type: String,
        required: [true,"Please Enter Product Description"]
    },
    price:{
        type: Number,
        required: [true,"Please Enter Product Price"],
        maxLength:[8,"price cannot exceed 8 characters"]
    },
    ratings:{
        type: Number,
        default:0
    },
    images:[ //image ta k array te newa hoice krn ek ta product er koek ta image takte pare tai oi ta array er modde object akare takbe
        {
            public_id:{
                type: String,
                required:true,
            },
            url:{
                type: String,
                required:true
            }
        }
    ],
    category:{
        type: String,
        required: [true,"Please Enter Product Category"]
    },
    stock:{
        type: Number,
        required: [true,"Please Enter Product Stock"],
        maxLength:[4,"stock cannot exceed 4 characters"],
        default:1
    },
    numOfReviews:{
        type: Number,
        default:0,
    },
    reviews:[
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required:true,
            },
            name: {
                type: String,
                required:true,
            },
            rating: {
                type: Number,
                required:true
            },
            comment:{
                type: String,
                required:true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:true,
    },
    createdAt:{
        type: Date,
        default:Date.now
    }

})

module.exports = mongoose.model("Product",productSchema);