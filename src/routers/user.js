const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const Sharp = require('Sharp')
const {sendWelcomeEmail,sendCancellationEmail} = require('../emails/account')

router.post('/users',async (req,res)=>{
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.GenerateWebToken()
        res.send({user,token})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findByCredentails(req.body.email,req.body.password)
        const token = await user.GenerateWebToken()
        //res.send({user:user.getPublicProfile(),token})
        res.send({user,token})
    }catch(e){
        res.status(401).send()
    }
})

router.post('/users/logout',auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async (req,res)=>{
    try{
       // req.user.tokens = req.user.tokens.filter((token)=>{
       //     return false
       // })
       req.user.tokens =[]
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me',auth,async (req,res)=>{
    //console.log(req.user)
    res.send(req.user)
    //  try{
    //      const users = await User.find({_id :req.user._id})
    //      res.send(users)
    //  }catch(e){
    //      res.status(500).send(e)
    //  }
})
// router.get('/users/:id',async (req,res)=>{
//     _id = req.params.id
//     try{
//         const users = await User.findById(_id)
//         if (!users) {
//             return res.status(404).send()
//         }
//         res.send(users)
//     }catch(e){
//         res.status(500).send(e) 
//     }
// })
router.patch('/users/me',auth,async (req,res)=>{
    const allowedupdates = ['name','password','email','age']
    const updates = Object.keys(req.body)
    const isvalidoperator = updates.every((update)=>allowedupdates.includes(update))
    if (!isvalidoperator) {
        return res.status(404).send({error: 'invalid parameter'})
    }
    try{
        //const users = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        //const user = await User.findById(req.params.id)
        const user = req.user
        updates.forEach((update)=>{
            user[update] = req.body[update]
        })
        await user.save()        
        res.send(user)
    }catch(e){
        res.status(404).send()
    }
})

router.delete('/users/me',auth,async (req,res) =>{
    try{
        req.user.remove()
        sendCancellationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(404).send()
    }
})
const upload = multer ({
    //dest : 'avatars',
    limits:{
         fileSize:1000000
    },
    fileFilter(req,file,cb){
         if(!file.originalname.match(/\.(pn|jp)(|e)g$/)){
             return cb(new Error ('upload jpg jpeg or png file'))
         }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar',auth, upload.single('avatar'),async (req,res) =>{
    const buffer = await Sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    //req.user.avatar = req.file.buffer
    req.user.avatar = buffer
    await req.user.save()
    res.send()  
},(error,req,res,next)=>{
    return res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar',auth,async (req,res) =>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()  
},(error,req,res,next)=>{
    return res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar',async (req,res) =>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','Image/png')  
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})
module.exports = router