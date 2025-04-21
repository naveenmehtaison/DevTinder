const mongoose = require('mongoose')
const  ConnectDB= async ()=>{
    await  mongoose.connect('mongodb+srv://naveenmehta099:PAmVdrPBIgaMJgTp@namastenode.kuka3.mongodb.net/devtinder')
}

module.exports = ConnectDB
