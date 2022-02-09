const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')



router.post("/tasks",auth,async (req, res) => {
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
     await task.save()
      res.status(201).send(task)
    }catch(e){
        res.status(500).send(e)
    }
      
  });
  router.get("/tasks",async (req, res) => {
  try{
      const tasks =await Task.find({})
      res.send(tasks)
  }catch(e){
      res.status(500).send(e)
  }
  });
  router.get("/tasks/:id", async(req, res) => {
  try{
      const task = await Task.findById(req.params.id)
      res.send(task)
  }catch(e){
      res.status(500).send(e)
  }
  });
  router.patch('/tasks/:id',async(req,res)=>{
      const updates = Object.keys(req.body)
      console.log(updates)
      const validUpadtes = ["desciption","completed"]
      const isValidUpdate = updates.every((val)=>{
          return validUpadtes.includes(val)
      })
      if(!isValidUpdate){
         return res.status(404).send('Invalid Upadte')
      }
  
      console.log(req.params.id)
      try{
          const task =await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
          if(!task){
                 res.status(400).send("Not Found")
          }
           
          res.send(task)
      }catch(e){
          res.status(500).send(e)
      }
  })
  router.delete('/tasks/:id',async (req,res)=>{
      // try{
      //     const task = await Task.findOneAndDelete(req.params.id)
      //     if(!tsak){
      //       return  res.status(404).send('Task not found')
      //     }
      //     console.log(task)
      //     res.send(task)
      // }catch(e){
      //     res.status(500).send(e)
      // }
      try{
          const task = await Task.findByIdAndDelete(req.params.id)
          if(!task){
           return   res.status(404).send('Task not found')
          } 
          res.send(task)
      }catch(e){
          res.status(500).send(e)
      }
  })
  module.exports = router