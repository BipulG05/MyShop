const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your name"],
        maxLength:[30,"Name connot exceed 30 characters"],
        minLength:[4,"Name should have more than 4 character"]
    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:true,
        validate:[validator.isEmail,"please enter a valid email"]

    },
    password:{
        type:String,
        required:[true,"please Enter the password"],
        minLength:[6,"password should have more than 6 character"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    creatAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})
//Jwt Token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
}

//compare password
userSchema.methods.comparePassword = async function (Ipassword) {
    return await bcrypt.compare(Ipassword, this.password);
  };

//generate forgot password token
userSchema.methods.getResetPasswordToken = function (){
    //Generate Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // hasing and adding to user schema
    this.resetPasswordToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 *60 * 1000;
    return resetToken;
};


module.exports =mongoose.model("User", userSchema);