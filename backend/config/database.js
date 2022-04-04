const mongoose = require('mongoose');

const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true
    }).then((data) => {
        console.log(`Mongodb Connect with server : ${data.connection.host}`);
    });
    // .catch((err) => {console.log(err)}) //unhandled promise rejection e code korai ei ta comment kore dewa hoice
};

module.exports=connectDatabase;