const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/tasks')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required : true,
        trim:true
    },
    password:{
        type: String ,
        required:true,
        trim : true,
        min : 6,
        validate(value){
            if (value.includes('password')){
                throw new error(' password value is incorrect')
            }
        }
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new error ('is not a valid email address')
            }
        }
    },
    age:{
        type : Number,
        default : 0,
        validate(value){
            if (value< 0) {
                throw new error('Age should be positive')
            }
        }
    },
    tokens:[{
            token:{
                type:String,
                required:true               
            }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps: true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField : '_id',
    foreignField : 'owner'
})
// userSchema.methods.getPublicProfile = function (){
//     const user = this
//     const userObject = user.toObject()
//     delete userObject.password
//     delete userObject.tokens
//     return userObject
// }
userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
userSchema.methods.GenerateWebToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token:token})
    await user.save()
    return token
}
userSchema.statics.findByCredentails = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error ('unable to login')
    }
    const isallowed = await bcrypt.compare(password,user.password)
    if (!isallowed){
        throw new Error ('unable to login')
    }
    return user
}
userSchema.pre('save',async function(next){
    const user = this    
    if( user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()  
})

// delete all task for a user

userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User