const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');//try catch function
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require("cloudinary");


// Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    sendToken(user, 201, res);///ei function tar kaj niche comment kora hoice
    // -------------------------------
    // const token = user.getJWTToken();
    // console.log(user,"user")
    // console.log(token,"token")
    // const options = {
    //     expires: new Date(
    //         Date.now()+ process.env.COOKIE_EXPIRE + 24 * 60 * 60 * 1000
    //     ),
    //     httpOnly: true,
    // };
    //  res.status(201).cookie('token',token,options).json({
    //     success: true,
    //     user,
    //     token
    // });---------------------------
});


//LOGIN USER
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    //checking if user given email and password both

    //if user did not provide email and passs throw error // email ba pass j kono ek ta false hole means j kono ek ta na dile
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 401));
    }
    //userModel password select false dewa ace tai ei kane select("+password") diye password ta k newa hocce
    const user = await User.findOne({ email }).select("+password");//ei findOne email dileo password direct dewa hoi nai oi ta .select("+password") ei vabe dewa hoice krn userModel e password selec:false dewa ace tai...

    if (!user) {//jodi user find kore na pai means user na takle ba user false asle
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);//user e email and password pawar por password match kina check korbe

    if (!isPasswordMatched) {//pass jodi match na hoi
        next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user, 200, res);//niche ei ta kora hoice
    // const token=user.getJWTToken();
    // res.status(200).json({
    //     success: true,
    //     user,
    //     token,
    // });

});


//LOGOUT User==========
exports.logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),//options ta likha hocce..now time ba ekn e cookie tekhe token expires hoye jabe
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: 'User logged out',

    });
});


//Forgot Password========
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Get Reset Password Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    ///Send Email for Reset password 
    // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}password/reset/${resetToken}`;
    const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\n if you have not requested this email then, please ignore it`

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});


//Reset Password //email ashar por password set korar kaj 
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    // find reset token in database
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },//time expire howar aghe pas
    });

    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.password;//password chnaged here
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});


//Get User Details (user)
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);//req.user auth tekhe newa 

    res.status(200).json({
        success: true,
        user
    });
});

//Update User Password (user)
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");//req.user auth tekhe newa// ei kane password soho select kora lagbe
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);//user e email and password pawar por password match kina check korbe

    if (!isPasswordMatched) {//pass jodi match na hoi
        next(new ErrorHandler("Old Password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) { //newPasswowrd and confirmPassword match na hoi taile errrir thrie korbe 
        next(new ErrorHandler("Password new and confirm doesn't match", 400));
    }


    user.password = req.body.newPassword;//upore condition par kore asle user.password e newPassword assign hobe
    await user.save();


    sendToken(user, 200, res);
});


//Update User Profile (user)
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };
    //we will use cloudinary later for avatar
    if (req.body.avatar !== "") {//jodi req.body.avatar khali na hoi tahole,,jodi update e image e chnage ashe mane onno pic dile

        const user = await User.findById(req.user.id);

        // const imageId = user.avatar.public_id;
        // await cloudinary.v2.uploader.destroy(imageId);
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    });
});


//Get All Users Details(Admin)
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });
});

//Get Single User Details(Admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exit with id: ${req.params.id}`, 400));
    }

    res.status(200).json({
        success: true,
        user
    });
});


//Update User Role--- admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, { //req.user.id dile admin nijer role update hpye jabe...params tekhe id niye oi user role chnage kora lagbe
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (!user) {
        return next(new ErrorHandler(`User does not exit with id: ${req.params.id}`, 400));
    }

    res.status(200).json({
        success: true
    });
});

//Delete User --- admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exit with id: ${req.params.id}`, 400));
    }

    //Remove user profile picture from cloudinary
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});