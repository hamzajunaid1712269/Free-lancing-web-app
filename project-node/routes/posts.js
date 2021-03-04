const express = require("express");
const {Post,validate }= require("../models/post");
const {Comment}= require("../models/comment");
const { User } = require("../models/user");
const config = require('config');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const auth = require("../middleware/auth");
const router = express.Router();
const {Client,Developer} =  require('../middleware/role');


const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});


router.post('/',[auth,Client,multer({ storage: storage }).single("image")], (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
       creator:req.userdata._id,
       creatorname:req.userdata.name
       
        
       
      });
      post.save().then(createdPost => {
        res.status(201).json({
          message: "Post added successfully",
          post: {
            ...createdPost,
            id: createdPost._id
          }
        });
      });
    }
  );


  router.get('/Myposts', [auth, Client],async(req, res)=> {
    Post.find({
      creator: req.userdata._id
      }).exec(function(err, Post){
        if (err) return res.send(err);
        res.json(Post);
    });
});

  router.get('/', async (req, res, next) => {
    Post.find({
      status:"searching"
    }).exec(function(err, Post){
      if (err) return res.send(err);
      res.send(Post);
  });
  });
  
  router.post("/:id/comment",[auth,Developer],async (req,res) =>{
      const post=await Post.findOne({_id: req.params.id});
      const comment=new Comment();
      comment.content=req.body.content;
      comment.post=post._id;
      comment.creator=req.userdata.name;
      comment.email=req.userdata.email
      await comment.save();

      post.comments.push(comment._id)
      await post.save();
      res.send(comment);
     
  });

  router.get("/:id/comment",async (req,res) =>{
    const post=await Post.findOne({_id: req.params.id}).populate("comments",'content')
    

   
    res.send(post)
   
});

router.put('/assign/:id',[auth,Client],async(req, res)=> {
 
  
  const post = await Post
  .findById(req.params.id);
  

  if (!post) return res.status(404).send("Post not found");
 
  post.assign=req.body.assign
  post.status="assign"

   
  

  let promises = [];

  promises.push(post.save());
  let result = [] 
  result = await Promise.all(promises);
  res.send(result);
  

     });


     router.put('/review/:id',[auth,Developer],async(req, res)=> {
 
  
      const post = await Post
      .findById(req.params.id);
      
    
      if (!post) return res.status(404).send("Post not found");
     
      post.developerreview=req.body.developerreview
      post.status="review"
    
       
      
    
      let promises = [];
    
      promises.push(post.save());
      let result = [] 
      result = await Promise.all(promises);
      res.send(result);
      
    
         });

     router.get('/dev',[auth,Developer],async(req, res)=> {
      Post.find({
          assign:req.userdata.email
        }).exec(function(err, Post){
          if (err) return res.send(err);
          res.send(Post);
      });
  });


  router.get('/sendback',[auth,Developer],async(req, res)=> {
    Post.find({
        assign:req.userdata.email,
        status:"sendback"
      }).exec(function(err, Post){
        if (err) return res.send(err);
        res.send(Post);
    });
});


  router.put('/response/:id',[auth,Client],async(req, res)=> {
 
  
    const post = await Post
    .findById(req.params.id);
    
  
    if (!post) return res.status(404).send("Post not found");
   
    post.clientresponse=req.body.clientresponse
    post.status=req.body.status
  
     
    
  
    let promises = [];
  
    promises.push(post.save());
    let result = [] 
    result = await Promise.all(promises);
    res.send(result);
    
  
       });


       router.put('/updatetitle/:id',[auth,Client],async(req, res)=> {
 
  
        const post = await Post
        .findById(req.params.id);
        
      
        if (!post) return res.status(404).send("Post not found");
        
       
        post.title=req.body.title;
        post.content=req.body.content;
       
      
         
        
      
        let promises = [];
      
        promises.push(post.save());
        let result = [] 
        result = await Promise.all(promises);
        res.send(result);
        
      
           });


  router.get('/review/:id',[auth,Client],async(req, res)=> {
    Post.find({
      _id:req.params.id,
        creator:req.userdata._id,
        status:"review"
      }).select('developerreview').exec(function(err, Post){
        if (err) return res.send(err);
        res.send(Post);
    });
});

router.get('/res/:id',[auth,Developer],async(req, res)=> {
  Post.find({
       _id:req.params.id,
      assign:req.userdata.email,
      status:"sendback"
    }).select('clientresponse').exec(function(err, Post){
      if (err) return res.send(err);
      res.send(Post);
  });
});

router.delete("/:id",[auth,Client], (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userdata._id }).then(
    result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    }
  );
});

  module.exports = router;

