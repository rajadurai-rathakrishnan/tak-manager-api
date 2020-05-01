const mongoose = require('mongoose')
const validator = require('validator');
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
})
// const User = mongoose.model('User',{
//     name:{
//         type: String,
//         required : true
//     },
//     password:{
//         type: String ,
//         required:true,
//         trim : true,
//         min : 6,
//         validate(value){
//             if (value.includes('password')){
//                 throw new error(' password value is incorrect')
//             }
//         }
//     },
//     email:{
//         type:String,
//         validate(value){
//             if (!validator.isEmail(value)){
//                 throw new error ('is not a valid email address')
//             }
//         }
//     },
//     age:{
//         type : Number,
//         default : 0,
//         validate(value){
//             if (value< 0) {
//                 throw new error('Age should be positive')
//             }
//         }
//     }
// })
// const me = new User({
//     name:'Raja',
//     password:'password',
//     email: 'test@test.com',
//     age : 3
// })
// // me.save().then(()=>{
// //     console.log(me)
// // }).catch((error)=>{
// //     console.log(error)
// // })

// const tasks = mongoose.model('tasks',{
//     description :{
//         type :String,
//         trim:true,
//         required:true
//     },
//     completed :{
//         type : Boolean,
//         default:false
//     }
// })
// const me_task = new tasks({
//     description: 'Learn JAVA'
//    // completed : true
// })
// me_task.save().then(()=>{
//     console.log(me_task)
// }).catch((error)=>{
//     console.log(error)
// }
// )
