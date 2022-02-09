const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ',"")
        const decoded  = jwt.verify(token,'thisismysecretekey')
        console.log(decoded);
        
        const user = await User.findOne({_id:decoded._id,'tokens.token':token})
        if(!user){
            throw new Error('User not exist')
        }
        // console.log(user);
        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).send({error:'Authentication failed'})
        next()
    }

}
module.exports = auth