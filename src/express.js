const express = require('express')
const app = express()

app.listen(7777)
app.use('/test', (req,res)=>{
    res.send('insinde tesrt 2')
})
app.use('/',(req,res)=>{
    res.send('ininsde nothing')
})