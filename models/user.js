const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  items: [{task: String, done: {type: Boolean, default: false}}]  
})

const user = mongoose.model("users", userSchema);

module.exports = user;
