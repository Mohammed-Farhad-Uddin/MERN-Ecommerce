const mongoose = require('mongoose');
const validator = require('validator');//ei package install kora hoice email validate korar jnno
const bcrypt = require('bcryptjs');//ei package install kora lagbe password encypt korar jnno
const jwt = require('jsonwebtoken');//ei package install kora lagbe user token store kore rakhar jnno 
const crypto = require('crypto');//ei package build in package jei ta install kora lage nai.

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        minLength: [4, "Name should have more than 4 character"],
        maxLength: [30, "Name can't exceed 30 characters'"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please enter e valid email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [4, "Password should be more than 4 characters"],
        select: false //select:false dile find({}) ei diye call dile pass tao chole asbe.pass k baad diye baki gula ante select:false dile password ta get kora jabe na.
    },
    avatar: { //ei ta k array akare rakha hoi nai krn ek ta user er jnno ek ta image ba avatar takbe
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

//Password will encrypt before save userSchema----- 
userSchema.pre("save", async function (next) {// userSchema.pre("save") mane useSchema save howar aghe password encrypt kre fela
    if (!this.isModified("password")) {//ei condition er kaj holo password modified kora hole ei ta abr bcrypt hobe r jodi password tik takhe and other info jodi update kora hoi tahole isModified("password") false hobe and condition kaj kore next() call hobe...r jodi isModified("password") true hoi mane password modify hole condition a na dukhe userSchema save howar purbe mane pre  password hash kore nibe
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)//LAST 10 ta holo power ei ta joto besi hobe toto ta encrypted codde create hobe..//ei arrow function use korar krn hocce this keyword use kora hobe tai..arrow function e this keyword kaj korbe na
})
// userSchema.pre("save", async function(next) {// userSchema.pre("save") mane useSchema save howar aghe password encrypt kre fela
//     if(this.isModified("password")) {//ei condition er kaj holo password modified kora hole ei ta abr bcrypt hobe r jodi password tik takhe and other info jodi update kora hoi tahole isModified("password") false hobe and condition kaj kore next() call hobe...r jodi isModified("password") true hoi mane password modify hole condition a na dukhe userSchema save howar purbe mane pre  password hash kore nibe
//         this.password = await bcrypt.hash(this.password,10)//LAST 10 ta holo power ei ta joto besi hobe toto ta encrypted codde create hobe..//ei arrow function use korar krn hocce this keyword use kora hobe tai..arrow function e this keyword kaj korbe na
//     }else{
//         next();
//     }
// });


//JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE, })
}

//Compare Password to match
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}


//Generationg Password reset token
userSchema.methods.getResetPasswordToken = function () {

    // Generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}


module.exports = mongoose.model("User", userSchema); 