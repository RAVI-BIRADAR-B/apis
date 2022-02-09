const mongoose = require("mongoose");
const valiadator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(val) {
      if (!valiadator.isEmail(val)) {
        throw new Error("Email is not valid");
      }
    },
  },
  password: {
    type: String,
    trim: true,
    required: true,
    validate(val) {
      if (val.toLowerCase().includes("password")) {
        throw new Error('possword should not contain "password" ');
      }
      if (val.length < 7) {
        throw new Error(
          "password min leangth should be more that 6 characters"
        );
      }
    },
  },
  age: {
    type: Number,
    default: 10,
    validate(val) {
      if (val < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }]
});

userSchema.virtual('tasks', {
  ref:'Task',
  localField:'_id',
  foreignField:'owner'
})
// Hiding private data
userSchema.methods.toJSON = function(){
  const user = this
  const userObject =  user.toObject()
  delete userObject.password
  delete userObject.tokens
  return userObject
}

//Auth token
userSchema.methods.generateAuthToken = async function(){
  const user = this
  const token = jwt.sign({_id:user._id.toString()},'thisismysecretekey')
  user.tokens = user.tokens.concat({ token})
  await user.save()
  console.log("abt to send token",token)
  return token
}
// useSchema Login
userSchema.statics.findByCredentials = async (email, password) => {
  const user =await User.findOne({ email });
  if (!user) {
    throw new Error("Unable does not exist  ");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};
userSchema.pre("save", async function (next) {
  const user = this;
  console.log("In pre");
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  console.log("just before saving ");
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
