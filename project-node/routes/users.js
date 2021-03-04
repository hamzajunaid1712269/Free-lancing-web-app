const config = require('config');
const jwt = require("jsonwebtoken");
const express = require('express');
const {User, validate} = require('../models/user');
const {Comment} = require('../models/comment');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');



router.post('/', async(req, res)=> {
    console.log(req.body);
  
    const {error} = validate(req.body);
    if (error) { console.log(error); return res.status(400).send(error.details[0].message);}  
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered.');
    user = new User({ 
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        userType: req.body.userType, 
         
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
  
    res.send(_.pick(user, ["_id","name","email","userType"]));
    
})

router.get('/', async (req, res) => {
    
        const user = await User.find().select('-password')
        res.send(user);
    });
    module.exports = router;