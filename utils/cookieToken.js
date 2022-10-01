const cookieToken = ({User,res}) => {
 const token = User.getJwtToken();
 const options = {
   expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
   httpOnly: true,
 };
//  console.log(User)
 res.status(200).cookie("token", token, options).json({ success: true, User });
}



module.exports = cookieToken;