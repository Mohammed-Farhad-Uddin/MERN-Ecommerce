const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');//ei package install kora lagbe user token store kore rakhar jnno 
const User = require('../models/userModel');


exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    // const token = req.cookies; eita value and property both console hobe
    const { token } = req.cookies;//ei just value ta console hobe
    // console.log(token);

    if (!token) {
        next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    //req.user e store kora hocce tar mane jotokkn user tekhe req pabe totokkn data ta store kore rakbe..user tekhe req asle tkn req.user e data assign hobe
    req.user = await User.findById(decodedData.id);//userModel er JWT token e jwt.sign({id:this._id} er ei id ta.//jei user login kora takbe tar data req.user e store hobe and oi kan tekhe user er id ba other access kora jabe
    next();
});


exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        //ei kane if diye ! dice means user role jodi na pai//roles.includes er value true hole mane role ta takle ei ta if(!true) = false taile if condition skip kore tarpoere next() kaj korbe,,r jodi role include na takhe if(!false)=true tkn if condition kaj korbe ..............ei ta ektu tricky
        if (!roles.includes(req.user.role)) {//...roles kore ei ta array howar por roles.includes function hocce.//upore req.user =await User.findById(decodedData.id) e sob data store kora hoice 
            return next(new ErrorHandler(`Role : ${req.user.role} does not allow to access this resource`, 403))
        }

        next();

        // //    niche ei ta sohoj kore liklam bujar jnno
        // if (roles.includes(req.user.role)) {
        //     next();
        // } else {
        //     return next(new ErrorHandler(`Role : ${req.user.role} does not allow to access this resource`, 403));
        // }
    }
}