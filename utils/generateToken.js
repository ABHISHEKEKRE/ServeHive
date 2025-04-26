const jwt=require('jsonwebtoken')
const generateTokenSetCookie=(id,res,userType)=>{
    const token=jwt.sign({id,userType},process.env.JWT_SECRET,{
        expiresIn:'15d'
    });
    res.cookie("jwt",token,{
        maxAge:15*24*60*60*1000,
        httpOnly:true, //xss attack stop
        sameSite:"strict" //csrf attack stop
    })
};
module.exports= generateTokenSetCookie ;