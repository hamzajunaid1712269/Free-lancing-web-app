const mongoose = require('mongoose');
const path = require("path");
const config= require('config');
const express = require('express');
const user = require('./routes/users');
const post = require('./routes/posts');
const auth = require('./routes/auth');
const comment = require('./routes/comments');
const app = express();


if (!config.get("jwtPrivateKey")) {
    console.error("FATAL Error: JWT SignatureKey is not defined");
    process.exit(1);
  }

mongoose.connect('mongodb://localhost/Project',{ useNewUrlParser: true,useUnifiedTopology: true})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));
  
  
  app.use(express.json());
  app.use("/images", express.static(path.join("images")));
  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods',"PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Origin", "*"); // keep this if your api accepts cross-origin requests
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, auth-token");
    next();
}
)
app.use('/api/users', user);
app.use('/api/posts', post);
app.use('/api/auth', auth);
app.use('/api/comments', comment);




const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}`));