const mongoose = require('mongoose')
const valiadator = require('validator')

const taskSchema = new mongoose.Schema(
    {
        desciption:{
            type:String,
            required:true,
    
        },
        completed:{
            type:Boolean,
            default:false
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'User'

        }
    }
)

const Task = mongoose.model('tasks',taskSchema)
module.exports = Task