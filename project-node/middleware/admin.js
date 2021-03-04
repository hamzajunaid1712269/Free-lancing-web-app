
module.exports = function (req, res, next) { 
    // 401 Unauthorized
    // 403 Forbidden 
    console.log(req.user.userType.toLowerCase().toString())
    if (!(req.user.userType.toLowerCase().toString() == "admin")) return res.status(403).send('Access denied.');
    next();
  }