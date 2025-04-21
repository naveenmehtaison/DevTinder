const mongoose = require('mongoose')
const { applyTimestamps } = require('./user')
const ConnectionStringSchema = new mongoose.Schema(
    {
    fromuserId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    touserId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    Status:{
        type:String,
        enum:{
            values:['accepted','rejected','ignored','intrested'],
            message:'{VALUE} is not accepted'
        }
    }
},{timestamps: true})
ConnectionStringSchema.pre('save',function(next){
    const connectionrequest = this

    if(connectionrequest.fromuserId.equals(connectionrequest.touserId)){
        throw new Error('Invalid Calls')
    }
    else(
        next()
    )

})
const ConnectionRequestModal = mongoose.model('ConnectionRequest',ConnectionStringSchema)
module.exports = ConnectionRequestModal