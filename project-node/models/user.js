const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        minlength:5,
        maxlength:50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    userType: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength:5,
        maxlength: 1024
     },
   

  
    
})
userSchema.methods.generateAuthToken = function () {
    console.log('KEY');
    console.log(config.get('jwtPrivateKey'));
    const token= jwt.sign({_id:this._id,name:this.name,userType:this.userType,email:this.email},config.get('jwtPrivateKey'),{expiresIn:60*3});
    return token;
  };

const User = mongoose.model('User', userSchema);

   function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        userType: Joi.string().min(5).max(50).required()
       
    };
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;