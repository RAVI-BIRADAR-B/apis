const express = require("express");
const app = express();
require("./db/mongoose");
const bycrypt = require("bcrypt");
const port = process.env.PORT || 3000;
app.use(express.json());
const taskRouter = require("./routes/task");
app.use(taskRouter);
const userRouter = require("./routes/user");
app.use(userRouter);
const User = require('./models/user')
const Task = require('./models/task')

const mongoose = require('mongoose')
app.listen(port, () => {
  console.log("server is up");
});
const handleEnCrypt = async () => {
  const password = "ravi@1996";
  const hashPassword = await bycrypt.hash(password, 8);
  console.log(hashPassword);
  const isMatch = await bycrypt.compare("ravi@1996", hashPassword);
  console.log(isMatch);
};
handleEnCrypt();
const main = async ()=>{
  const user =await User.findById('61e8fc2711cdddd52cb98b13')
  user.populate('tasks').execPopulate()
  // console.log(user);
  
}
main()
