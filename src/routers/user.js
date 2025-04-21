const express = require('express')
const authmiddleware = require('../middleware/middleware')
const userRouter = express.Router()
const ConnectionRequestModal = require('../models/connectionrequest')
const User = require('../models/user')
userRouter.get('/user/connectionrequest/received', authmiddleware, async(req, res)=>{
    try{
        const logged_in_user = req.user
        const request_received =  await ConnectionRequestModal.find({touserId:logged_in_user._id, Status:'intrested'}).populate('fromuserId',['firstName','lastname','photo'])
        res.send(request_received)
    }
    catch(err){
        res.status(400).send(err+ 'Error')

    }
})
userRouter.get('/user/connections',authmiddleware, async(req,res)=>{
    try{
        const logged_in_user = req.user
        const connections = await ConnectionRequestModal.find({ $or:[{touserId:logged_in_user._id},{fromuserId:logged_in_user._id}], Status:'accepted'}).populate('fromuserId','firstName photo').populate('touserId','firstName photo')
       const correctdata =  connections.map((row)=>{
            if(row.fromuserId._id.toString()===logged_in_user._id.toString()){
                return row.touserId
            }
            return row.fromuserId
        })
        res.json({res:correctdata})

    }
    catch(err){
        res.status(400).send(err)

    }
})
userRouter.get('/user/feed', authmiddleware, async(req,res)=>{
    
    try{
        const page = req.query.page || 1
        const limit = req.query.limit || 10
        const stack = (page-1)*limit
        const logged_in_user = req.user
        const blocked_user =await  ConnectionRequestModal.find({$or:[{fromuserId:logged_in_user._id}, {touserId:logged_in_user._id}]}).select('fromuserId touserId')
       
        const New_set = new Set()
        blocked_user.forEach((ele)=>{
            New_set.add(ele.fromuserId.toString())
            New_set.add(ele.touserId.toString())
        })
        const user_feed = await User.find({
            $and:[{ _id: { $nin: Array.from(New_set) } }, {_id: {$ne:logged_in_user._id}}]}).select('firstName about photo').limit(limit)
            res.send(user_feed)
    }
    catch(err){
        console.log(req)
        res.status(400).send(err)
    }

})
module.exports = userRouter