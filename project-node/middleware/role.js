module.exports = {
    
  
    Client: (req, res, next) => { 
  
       
      console.log(req.userdata.userType.toString());
      console.log(req.userdata.userType);
      if (!(req.userdata.userType.toLowerCase().toString() == "client")) return res.status(403).send('Access denied.');
      next();
    },
    

    Developer: (req, res, next) => { 
  
       
        console.log(req.userdata.userType.toString());
        console.log(req.userdata.userType);
        if (!(req.userdata.userType.toLowerCase().toString() == "developer")) return res.status(403).send('Access denied.');
        next();
      },
      
}