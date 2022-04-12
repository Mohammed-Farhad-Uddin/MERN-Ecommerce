const app = require('./app');
// const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const cloudinary = require("cloudinary");

//ei excepton upore korte hoi
//Handle uncaught exceptions //example=console.log(youtube) ei ta handle uncaught exception
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to uncaught exceptions");
    process.exit(1);
});



// config
if (process.env.NODE_ENV !== 'PRODUCTION') {//heroku te deploy korle eitar dotenv er property gula oi kane takbe tai er tar kono kaj nai. ei ta tkni kaj korbe jkn heroku chara locally use korle tkn dotenv file ta lagbe,,tai ei condition dewa hoice
    require('dotenv').config({ path: "backend/config/config.env" });
}

//connectiong to database
connectDatabase();

//cloudinary add for image file
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// listenig the port
const server = app.listen(process.env.PORT, () => {
    console.log('listening on port ' + process.env.PORT);
});


//Unhandled Promise Rejection-----//ei rkm ek ta holo mongodb connection url e jodi kono mistake kora hoi taile oi ta holo unhandle promise rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection");

    server.close(() => {
        process.exit(1);
    });
});