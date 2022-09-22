exports.TestRoute = (req,res)=> {
  res.status(200).json({success: true, message: "Test route checked"})
}