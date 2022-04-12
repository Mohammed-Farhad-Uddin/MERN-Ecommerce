const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
// const dotenv = require('dotenv');
const path = require('path');


const errorHandleMiddleware = require('../backend/middleware/error');

// config
if (process.env.NODE_ENV !== 'PRODUCTION') {//heroku te deploy korle eitar dotenv er property gula oi kane takbe tai er tar kono kaj nai. ei ta tkni kaj korbe jkn heroku chara locally use korle tkn dotenv file ta lagbe,,tai ei condition dewa hoice
    require('dotenv').config({ path: "backend/config/config.env" });
}


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//Route imports
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', payment);



//Frontend url Backend url ek ta korar jnno npm run build er build folder tekhe index.html file niye ek server ana hocce
app.use(express.static(path.join(__dirname,"../frontend/build")));
app.get("*",(req, res) => {
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
});



// middleware for error
app.use(errorHandleMiddleware);


module.exports = app;