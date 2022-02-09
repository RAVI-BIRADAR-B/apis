const express = require('express');
const res = require('express/lib/response');
const jsonwebtoken = require('jsonwebtoken');
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post("/users", async (req, res) => {
    console.log(req.body)
    const user = new User(req.body);
    try {
      await user.save();
      const token  =await user.generateAuthToken()
      console.log(token,'token in route')
      res.status(201).send({user,token});
    } catch (err) {
      res.status(500).send(err);
      console.log(err);
    }
  });
  router.get("/users/me",auth,async (req, res) => {
  
     
  res.send(req.user)
  
  
  });
  router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !==req.token
        })
        console.log("yy");
        
     await   req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()

    }
  })
  router.post('/users/logoutall',auth,async (req,res)=>{
    try{
        req.user.tokens = []
       await req.user.save()
       res.send('Successfully logged out of all devices')
    }catch(e){
        res.status(400).send('Unable to logout from all devices')
    }
  })
  
  router.post('/users/login' ,async (req,res)=>{
try{
    console.log(req.body.email,req.body.password)

    const user = await User.findByCredentials(req.body.email,req.body.password)
    const token =await user.generateAuthToken()
    // const publicData = user.getPublicProfile()
res.send({user, token})
}catch(e){
    res.status(400).send("Logging in didnot work")
}
  })
  router.patch('/users/me',auth,async(req,res)=>{
      const updates = Object.keys(req.body)
      const allowedUpdates = ['name','email','password','age']
      const isValidOperation = updates.every((update)=>{
          return allowedUpdates.includes(update)
      })
      if(!isValidOperation){
          return res.status(404).send("Invalid Updates")
      }
      console.log("in patch")
      console.log(req.body)
      try{
    
        
        
        updates.forEach((update)=>req.user[update] = req.body[update] )
        await req.user.save()
       res.send(req.user)
      }catch(e){
          res.status(500).send()
      }
  })
  
  router.delete('/users/me',auth,async (req,res)=>{
      try{
        await  req.user.remove()
          res.send(req.user)
      }catch(e){
          res.status(500).send(e)
      }
  })
  module.exports = router