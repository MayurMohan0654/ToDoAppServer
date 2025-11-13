const user = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * getting the jwt secret.
 */
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;


/**
 * register the user to database
 * @param {username, password}
 * @returns {200: register Successfull, 409: conflict}
 */
const register = async (req, res) => {
  const {username, password} = req.body;

  const entity = await user.findOne({username: username});

  if(entity){
    return res.send({status: 409, message: "User Already Exists"});
  }else{
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = user({username, password: hashPass});

    await newUser.save();
    return res.send({status: 200, msg: "User Register Successfully"});
  }

}

/**
 * checks for the login credentials
 * @param {username, password}
 * @returns {ok: 200, UserNotFound: 404, Unauthorized: 401}
 */
const login = async (req, res) => {
  const {username, password} =  req.body;

  const entity = await user.findOne({username});

  if(!entity){
    return res.send({status: 404, msg: "User not Found Kindly Register."}) 
  }else{
    const match = await bcrypt.compare(password, entity.password); //true Or false
    if(match){

      const token = jwt.sign({username, role: "user", index: entity._id}, secretKey);
      return res.send({status: 200, msg: "Login Successfull", token});

    }else{
      return res.send({status: 401, msg: "Unauthorized"});
    }
  }

}


/**
 * 
 * @param {token: from headers["authorization"]}
 * @returns {next()}
 * @returns {404, Unauthorized}
 */
const authenicate = (req, res, next) => {
  const token = req.headers["authorization"];
  if(!token){
    return res.send({status: 401, msg: "Unauthourized"});
  }else{
    try{
      const data = jwt.verify(token, secretKey);
      req.body = {data}
      next();
    }catch(err){
      return res.send({status: 401, msg: "Tempted token"});
    }
  }
}



const decoded = (req, res) => {
  const {data} = req.body;
  return res.send({status: 200, data});  
}

module.exports = {register, login, authenicate, decoded}