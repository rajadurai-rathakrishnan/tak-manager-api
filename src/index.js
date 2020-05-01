const express = require('express')
const app = express()
require('./db/mongoose.js')
const auth = require('../src/middleware/auth')

//const User = require('./models/user.js')
//const Tasks = require('./models/tasks.js')
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/tasks')
port = process.env.PORT


// const multer = require('multer')
// const upload = multer ({
//     dest : 'images',
//     limits:{
//         fileSize :1000000
//     },
//     fileFilter(req,file,cb){
//         if(file.originalname.match(/\.(doc|docx)$/)){
//             return new Error('Please upload a doc file')
//         }
//         return cb (undefined, true)
//     }    
// })
// app.post('/upload', upload.single('upload') ,(req,res)=>{
//     res.send()
// })


app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

app.listen(port,(req,res)=>{
    console.log("Server side is running on port - " + port)
})


// const User = require('../src/models/user')

// const main = async ()=>{
//     try{
//         const user = User.findById('5ea3fed61601ba120cce5593')
//         await user.populate('tasks').execPopulate()
    
//         console.log(user.tasks)
//     } catch(e){
//         console.log (e)
//     }
// }

// main()
