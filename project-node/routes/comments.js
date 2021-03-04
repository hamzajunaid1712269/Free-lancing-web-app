const config = require('config');
const jwt = require("jsonwebtoken");
const express = require('express');
const {User, validate} = require('../models/user');
const {Comment} = require('../models/comment');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');

router.get('/:id',async(req, res)=> {
    Comment.find({
        post: req.params.id
      }).exec(function(err, Comment){
        if (err) return res.send(err);
        res.send(Comment);
    });
});
module.exports = router;