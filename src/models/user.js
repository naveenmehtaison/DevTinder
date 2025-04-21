const mongoose = require('mongoose')
const validator = require('validator')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const userSchema = new  mongoose.Schema({
    firstName:{
        type: String,
        required:true,
        minLength:4,
        maxLength:20,
        trim:true
    },
    lastName:{
        type:String,
        trim:true 
    },
    emailId:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate:(value)=>{
            //console.log(validator.isEmail(value))
            if(!validator.isEmail(value)){
                throw new Error('not a valid email' + value)
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:4,
        trim:true,
        validate:(value)=>{
            //console.log(validator.isStrongPassword(value),'keyyyyyy')
            if(!validator.isStrongPassword(value)){
                throw new Error('not a valid password' + value)
            }
        }
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate:(value)=>{
            if(!(['male','female'].includes(value))){
                return false
            }

        }
    },
    about:{
        type:String,
        default:'this is the default of about'
    },
    photo:{
        type:String,
        default:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/813px-Unknown_person.jpg',
        validate:(value)=>{
            if(!validator.isURL(value)){
                throw new Error('not a valid email' + value)
            }
        }
    },
    skills:{
        type:Array
    }
    

},{ timestamps: true })
userSchema.methods.getJWT = async function (){
    const user = this
    const token = await  jwt.sign({ foo: user._id }, 'Naveen@123#',{expiresIn:'1d'}
    );
    return token 
}
userSchema.methods.validatePassword = async function(password){
    const user = this
    //console.log(user.password)
    const passwordcheck = await bcrypt.compare(password, user.password)
    //console.log(passwordcheck)
    return passwordcheck
}
//always name the model awith capital letter 
//assume it as a class it iis used to create new instances
module.exports = mongoose.model("User",userSchema)