
const CustomError = require("../utils/CustomError");


exports.AccessRoles = (...roles) => {
  return (req,res,next)=> {
       if(!roles.includes(req.user.role)){
       return next(new CustomError("Unauthorized access", 403))
       }
       next()
  }
}
