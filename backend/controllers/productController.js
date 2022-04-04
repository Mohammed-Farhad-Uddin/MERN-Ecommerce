const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');//try catch function
const ApiFeatures = require('../utils/apifeatures');
const cloudinary = require('cloudinary');


//create Product--admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    let images = [];

    if (typeof req.body.images === 'string') {//jodi ek ta image input kore taile type hobe string,,jodi aro input dei taile oi tar type hobe,,,so ei kaner condition true hobe jkn ek ta image input dibe tkn type hobe string

        images.push(req.body.images);//ei kane string asbe tai array modde string k push diye type array te newa hocce and array akare rakha hocce

    } else {//jodi string na hoi mane ek tar cheye besi image input dile oi ta string akare asbe na,,, tkn array akare asbe tai upore images nam e array ace oi tar modde assign kore dile hobe
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        });
    }

    req.body.images = imagesLinks;//upore req.body.images tekhe pawa system er file er link gula k imageLink e cloudinary url e convert kore abr req.body.images a assign kora hocce 
    req.body.user = req.user.id;//req.body.user er modde User collection req.user.id mane ObjectId ta assign kore req.body te rakha hocce

    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
});


//Get All Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    // const products = await Product.find()

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apifeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);

    const products = await apifeatures.query;

    // //nicher line gular kaj jkn product search ba filter kora hobe tkn filter ba search hoye joto product asbe ta jodi resultPerPage er value takhe ba soman hoi taile niche pagination ta show kore lav nai krn next page e kicu takbe na ek page e sob product asbe r jodi ek page er cheye besi hoi taile resultPerPage tekhe besi hote hobe
    // const apifeatures = new ApiFeatures(Product.find(), req.query).search().filter(); 
    // let products=await apifeatures.query;
    // let filteredProductsCount = products.length;
    // apifeatures.pagination(resultPerPage);
    // products = await apifeatures.query;

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        // filteredProductsCount,
    })
});


//Get All Product(ADMIN)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products,
    })
});



//Update product -- admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    //let newar krn hoto ei ta k change kora hobe tai niche product ta abr use kora hoice
    let product = await Product.findById(req.params.id);

    if (!product) {// !product means product jodi true na hoi ba product jodi na takhe ba na pai
        return next(new ErrorHandler("Product not found", 404));
    }

    let images = [];
    if (typeof req.body.images === 'string') {//jodi ek ta image input kore taile type hobe string,,jodi aro input dei taile oi tar type hobe,,,so ei kaner condition true hobe jkn ek ta image input dibe tkn type hobe string
        images.push(req.body.images);//ei kane string asbe tai array modde string k push diye type array te newa hocce and array akare rakha hocce
    } else {//jodi string na hoi mane ek tar cheye besi image input dile oi ta string akare asbe na,,, tkn array akare asbe tai upore images nam e array ace oi tar modde assign kore dile hobe
        images = req.body.images;
    }


    if (images !== undefined) {// user update e ei rkm dicilam if(req.body.images !== "")//images jodi undefined na hoi mane e jodi khali na hoi orthat update e images e jodi kicu input dewa hoi tahole 
        //Delete old Image from cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        //Upload  new input image in cloudinary
        const imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }
        req.body.images = imagesLinks;
    }



    product = await Product.findByIdAndUpdate(req.params.id, req.body, {//req.params.id ta niye update howa body mane req.body replace kore dibe
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        product
    })
});

//Delete Product--admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
        // return res.status(500).json({
        //     success: false,
        //     message: `Product not found ${req.params.id}`
        // })
    }

    //Delete Image from cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: `Product deleted successfully ${req.params.id}`
    })
});

//Get single Product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        // return res.status(500).json({
        //     success: false,
        //     message: `Product not found`
        // })
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        //product: product
        product
    })
});


// ==========Review===============

//create new review and update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),//ei TA  reviews er bitor rating
        comment: comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString())//product er reviews array er modde per object k niye proti object er user er sathe j login kora ace tar id match hole se agheo review dicilo so se abr review dile tar agher review update hoye new review ta hobe...r jodi id match find kore na pai taile else e dukhe new review create korbe.

    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating,
                    rev.comment = comment
            }


        })
    } else {
        product.reviews.push(review);//productModel e reviews jei array ta ace oi ta te push korce
        product.numOfReviews = product.reviews.length;
    }

    ///product er ratings hobe reviews er rating er average
    let avg = 0;
    product.reviews.forEach(rev => { avg = avg + rev.rating })
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({ success: true });
});


///Get All Reviews of a product ========
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
});

///Delete review of a product ========
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString()); //req.query.id ta chara mane oi ta baad ba delete diye baki review filter kore return korbe

    //review delete korle ratings er poriborton hobe tai ei kane delete er por abr avg kora hocce ///product er ratings hobe reviews er rating er average
    let avg = 0;
    reviews.forEach(rev => avg = avg + rev.rating)//upore product.reviews tekhe nice ekn ei ta reviews er modde upor ek line e store kora hoice

    ///nicher part ta kora hocce jkn only ek ta review takbe tkn review ta delete korle error asbe krn tkn avg=0 reviews.length=0 ,,,0/0 hole undefined asbe ratings e tai ek ta review takle oi ta delete korte hole ratings=0 ana lagbe
    // const ratings = avg / reviews.length;//ei rkm aghe korci tai ei ta hobe na,, ei rkm line dile error asbe
    let ratings = 0;
    if (reviews.length === 0) {///jkn last review delete hobe tkn length 0 hoye jabe
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings, numOfReviews }, {///{ reviews,ratings, numOfReviews} oi product er modde ei gula update hobe
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
    })
});