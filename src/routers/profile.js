const express = require('express')
const User = require('../models/user')
var jwt = require('jsonwebtoken');
const authmiddleware = require('../middleware/middleware');
const { validateEditData } = require('../utils/validation');
const profilerouter = express.Router()
const bcrypt = require('bcrypt')
profilerouter.get('/profile/view', authmiddleware, async(req,res)=>{
        try{
        const cookies = req.cookies
        const {token} = cookies
        console.log('=>',token)
        if(!token){
           return res.status(401).send({ error: 'UnAuthorized Credentials' });
        }
        else{          
            var decoded =  jwt.verify(token, 'Naveen@123#');
            const user = await User.findOne({_id:decoded.foo})
            res.status(200).send(user)

        }
        }
        catch(err){
            res.status(400).send('ERROR'+ err)
        }
    })
profilerouter.post('/profile/edit', authmiddleware, async(req,res)=>{
    try{
        const valid_data  = validateEditData(req.body)
        if(!valid_data){
            res.status(400).send('Data not valid')
        }
        else if(valid_data){
            const id = req.user._id
            console.log(req.body)
            const updated_data = await User.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).send(updated_data)
        }
    }
    catch(err){
        res.send(err)

    }
    

})
profilerouter.post('/profile/edit/password', authmiddleware, async(req,res)=>{
    try{
        const {old_password,emailId,new_password} = req.body
        
        const user = await  User.findOne({emailId:emailId})
      
        

        const is_password_correct = await user.validatePassword(old_password)
        if(!is_password_correct){
            throw new Error('incorrect details')
        }
        else{
            const bcrypt_password = await bcrypt.hash(new_password,10)
            const instance = await User.findOneAndUpdate(user._id,{password:bcrypt_password})
            res.send({"msg":'password updated sucessfully',
                res:instance
            })
        }
    }
    catch(err){
        res.status(400).json({ error: err.message })

    }

})

profilerouter.get('/find',async(req,res)=>{
    const uniquefind = req.body.id
    try{
    const instance = await User.findById(uniquefind)
    
    res.send( instance)
    }
    catch(err){
        res.send(err)
    }
})
module.exports = profilerouter