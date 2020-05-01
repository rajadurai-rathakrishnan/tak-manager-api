const express = require('express')
const Task = require('../models/tasks')
const user = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks',auth ,async (req,res)=>{
    //const task = new Tasks(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e) 
    }
})
// ?completed=true
// ?tasks?limit=2&skip=0
// ?tasks?sortBy=completed:desc
router.get('/tasks', auth,async (req,res)=>{

    const match ={}
    const sort = {}
    if (req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1]=== 'desc' ? -1 : 1
    }
    try {
        //const tasks = await Task.find({owner:req.user._id})
       await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
       res.send(req.user.tasks) 
       //res.send(tasks) 
    }catch(e){
        res.status(500).send(e) 
    }
})
router.get('/tasks/:id',auth,async (req,res)=>{
    _id = req.params.id
    try{
       // const task = await Tasks.findById(_id)
        const task = await Task.findOne({_id,owner:req.user._id})       
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})
router.patch('/tasks/:id',auth, async(req,res)=>{
    const allowesCol = ['completed','description']
    const updates = Object.keys(req.body)
    const iSallowedOperator = updates.every((update)=>allowesCol.includes(update))
    if (!iSallowedOperator) {
        return res.status(404).send({error : 'Invalid updates'})
    }
    try{
        //const task = await Tasks.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        //const task = await Tasks.findById(req.params.id)
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        if (!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    }catch(e){
        return res.status(404).send()
    }
})
router.delete('/tasks/:id',auth, async (req,res) =>{
    try{
        //const task = await Tasks.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if (!task){
            res.send(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router