const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');//try catch function


//Create new Order 
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(200).json({
        success: true,
        order
    });
});


//Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {//ei kane req.params.id hoto order id ta
    const order = await Order.findById(req.params.id).populate("user", "name email");//populate("user","name email"); ei tar kaj,, jei params.id wala order ta find hobe oi tar modde jei user er id ta ace oi id ta user collection tekhe giye oi id wala user name and email nibe and user er name email soho order tar info order e store hobe
    //findById dile first braket e req.params.id ei ta pass kora jabe...r just find dile object pass korte hobe  such as fint(id: req.user._id)
    if (!order) {
        return next(new ErrorHandler("Oder not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        order
    });
});

//Get logged in user order
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id })
    res.status(200).json({
        success: true,
        orders
    });
});

//Get All Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;//joto gula user er order ace sobar total price ta total order e plus hobe
    });
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

//Update Order Status -- Admin
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);//req.params.id ei ta holo order id
    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }
    if (order.status === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (ord) => {
            await updateStock(ord.product, ord.quantity);//product order hole oi product er stock ba quantity change hoye jabe 
        });
    }

    order.orderStatus = req.body.status;//api te j body asbe oi tar status e jei ta patabo oi ta order er orderStauts e store hobe

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();//jkn status Delivered e set korbo tkn ei proterties and date er value create hoye db te store hobe
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});
async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    // product.stock = product.stock - quantity;
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
};
//----------------------------------------------------------------


//Delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("Oder not found with this Id", 404));
    }
    await order.remove();

    res.status(200).json({
        success: true,
    });
});



