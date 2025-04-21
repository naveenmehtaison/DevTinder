const express = require('express')
const CookieParser = require('cookie-parser')
const app = express()
const bcrypt = require('bcrypt')
const ConnectDB = require('./config/database')
const User = require('./models/user')
const validator = require('validator')
const { default: isEmail } = require('validator/lib/isEmail')
const authmiddleware = require('./middleware/middleware')
var jwt = require('jsonwebtoken');
const authrouter = require('./routers/authrouter')
const profilerouter = require('./routers/profile')
const requestrouter = require('./routers/request')
const userrouter = require('./routers/user')
const cors = require('cors')
app.use(express.json())
app.use(CookieParser())
app.use(cors());

app.use(authrouter)
app.use(profilerouter)
app.use(requestrouter)
app.use(userrouter)



ConnectDB()
    .then(() => {
        console.log('Connected to database');
        app.listen(7777, () => {
            console.log('Listening on port 7777');
        });
    })
    .catch((err) => {
        console.error('Error connecting to database:', err);
    });
app.get('/user/:userID',(req,res)=>{
    res.send('posting through get method')
})
app.use('/',(req,res)=>{
    res.send('ininsde nothing')
})

app.use('/test', (req,res)=>{
    res.send('insinde tesrt 2')
})
