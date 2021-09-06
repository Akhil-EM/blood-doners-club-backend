require('dotenv').config();
const jwt = require('jsonwebtoken');
 
const statusCodes = require("../utils/response-code");

const responseModel = require("../models/api/response.model");
const userModel = require("../models/db/user.model");

function authenticateUser(req,res,next){
    //getting token from header
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(" ")[1]; //either undefined or the token
    if(token==null){
       return res.status(statusCodes.not_acceptable).json(responseModel("error","no token found"));
    }else{
        //try to verify token 
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
            if(err) return res.status(statusCodes.unauthorized).json(responseModel("error","invalid token"));
            else{
                //cross check with db to find that user 
                // console.log(user)
                userModel.findById(user.id)
                        .then((user)=>{
                            if(user==null)return  res.status(statusCodes.unauthorized).json(responseModel("error","user not found"));
                            req.user=user
                            next()
                        }).catch((err)=>{
                            res.status(statusCodes.internal_server_error)
                               .json(responseModel("error",err+""));
                          })
               
            }
            
        })
    }
    
}


module.exports = {authenticateUser}