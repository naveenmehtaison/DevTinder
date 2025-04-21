const jwt = require('jsonwebtoken')
const User = require('../models/user')
const authmiddleware=async (req,res,next)=>{
    console.log(req.cookies.token ,'authmiddleware')
    try{
        const cookies = req.cookies
        const {token} =cookies
        if(!token){
            //console.log('token not found')
            throw new Error('No token found')
            
        }
        var decoded = await  jwt.verify(token, 'Naveen@123#');
        const user = await User.findOne({_id:decoded.foo})
        //console.log(user,'insinde middleware')
        req.user = (user)
        next()

    }
    catch(err){
        res.status(404).send('token not found')

    }
    


}
module.exports= authmiddleware