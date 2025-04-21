const express = require('express')
const authrouter = express.Router()
const bcrypt = require('bcrypt')
const validator = require('validator')
const User = require('../models/user')
authrouter.post('/login', async(req,res)=>{
    console.log('inside login')
    try{
        const {password, emailId} = req.body
        if(!validator.isEmail(emailId)){
            throw new Error('invalid credentials')
        }
        const user = await User.findOne({emailId:emailId})
       
        const IsPassWordCorrect = await 
         user.validatePassword(password)
        if(!IsPassWordCorrect){
            throw new Error('INvalid Credentials')
        }
        else{
            console.log('insinde else')
            const token = await  user.getJWT()
            res.cookie('token',token)
            res.send(user)
        }

    }
    catch(err){
        res.status(400).send('ERROR'+ err)
    }
})
authrouter.post('/signup', async (req,res)=>{
    const {firstName,lastName,emailId,password} = req.body
    console.log(req.body)
    //apply the validator right now iam skipping this

    //bcrypt the passowrd 
    try{
        if(!validator.isStrongPassword(password)){
            throw new Error('password no valid')
        }
    const bcrypt_password = await bcrypt.hash(password,10)
    const instance = new User({firstName,lastName,emailId,password:bcrypt_password})
    await instance.save()
    res.send('data saved sucessfully')     
    }
    catch(err){
        res.send('ERROR'+ err)
    }   

})
authrouter.post("/logout", async (req, res) => {
    res.cookie("token", null);
    res.send("Logout Successful!!");
  });
module.exports = authrouter

