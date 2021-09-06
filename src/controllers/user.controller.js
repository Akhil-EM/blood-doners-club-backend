const {  validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//models
const userModel = require('../models/db/user.model');
const locationModel = require('../models/db/location.model');
const tokenModel = require('../models/db/token.model')

const responseModel = require("../models/api/response.model")
const statusCodes=require("../utils/response-code");

//create user
exports.register = (req,res)=>{
     //check for validation errors from service center router 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }

    let user;
    let areaCommittee = req.body.areaCommittee;
    let locality = req.body.locality;
    //check which type of user is getting registered
    if(areaCommittee){
        user={
            name:req.body.name,
            phone:req.body.phone,
            password:req.body.password,
            status:"CONFIRMED",
            userType:"ROLE_ADMIN",
            areaCommittee:areaCommittee,
            locality:""}  
    }

    if(locality){
        user={
            name:req.body.name,
            phone:req.body.phone,
            password:req.body.password,
            status:"PENDING",
            userType:"ROLE_DONOR",
            areaCommittee:"",
            locality:locality} 
    }
    
    

    let user_model = new userModel(user);

    userModel.findOne({phone:req.body.phone})
              .then((user)=>{
                  if(user) return res.status(statusCodes.not_acceptable)
                                     .json(responseModel("failed","phone number already exists"));
    
                    //save to user collection
            user_model.save()
                      .then((user)=>{
                        // try to save to user detail collection 
                            res.status(statusCodes.ok)
                               .json(responseModel("success","new user registered"));
                                
                        })
                        .catch((err)=>{
                            res.status(statusCodes.internal_server_error)
                            .json(responseModel("error",err+""));
                        })
                  
              })
              .catch((err)=>{
                res.status(statusCodes.internal_server_error)
                .json(responseModel("error",err+""));
              })
};

exports.login = (req,res) =>{
    //validation 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }

    // check phone no exists
    let phoneNumber = req.body.phone;
    let password = req.body.password;
    userModel.findOne({phone:phoneNumber})
             .then((user)=>{
                 if(!user) return res.status(statusCodes.not_found)
                                     .json(responseModel("failed","this mobile no is not registered with us."));

                 let dbPassword = user.password;
                 let userID = user.id;
                 let userStatus =user.status;
                 
                 //prevent from login if the status is PENDING
                 if(userStatus === "PENDING"){
                    return res.status(statusCodes.unauthorized)
                              .json(responseModel("failed","your login under pending.contact your administrator."));
                 } 
              
                 try{
                     ///compare passwords using bcrypt
                     bcrypt.compare(password,dbPassword)
                           .then((result)=>{
                               if(result){
                                  //authentication success generate access and refresh tokens
                                  let accessToken = generateToken({id:userID},process.env.ACCESS_TOKEN_SECRET,'5m');
                                  let refreshToken = generateToken({id:userID},process.env.REFRESH_TOKEN_SECRET)
                                 
                                  const tokenObj = {
                                        token:refreshToken,
                                        // userId:userID,
                                        tokenType:"AUTH_TOKEN"}
                                  let token_model = new tokenModel(tokenObj);
                                  //save refresh token to db 
                                  token_model.save()
                                             .then(()=>{
                                                   ///send tokens to frontend
                                                return  res.status(statusCodes.ok)
                                                  .json(responseModel("success","login success"
                                                                              ,{accessToken:accessToken,
                                                                                refreshToken:refreshToken}));                                                
                                             }).catch((err)=>{
                                                res.status(statusCodes.internal_server_error)
                                                   .json(responseModel("error",err+""));
                                             })

                               }else{
                                   return res.status(statusCodes.unauthorized).json(responseModel("failed","invalid password"))
                               }
                               


                           }).catch((err)=>{
                              res.status(statusCodes.internal_server_error)
                                 .json(responseModel("error",err+""));
                           })
                     
                   

                 }catch(err){
                    res.status(statusCodes.internal_server_error)
                       .json(responseModel("error",err+""));
                 }
             })
             .catch((err)=>{
                res.status(statusCodes.internal_server_error)
                   .json(responseModel("error",err+""));
              })


}

exports.logout = (req,res) =>{
  
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(" ")[1]; //either undefined or the token
    if(token==null) return res.status(statusCodes.not_acceptable).json(responseModel("failed","no token found"));

    tokenModel.findOneAndDelete({token:token})
              .then(()=>{
                  res.status(statusCodes.ok).json(responseModel("success","successfully logged out."))
              }).catch((err)=>{
                res.status(statusCodes.internal_server_error)
                   .json(responseModel("error",err+""));
              })
   
}

exports.updatePassword = (req,res) => {
     //validation 
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(statusCodes.not_acceptable)
                   .json(responseModel("failed","validation errors",{errors: errors.array()}))
     }

     console.log(req.user);

     let DBpassword = req.user.password;
     let oldPassword = req.body.oldPassword;
     let newPassword = req.body.newPassword;
     let userID = req.user.id;
     


     if(oldPassword === newPassword) return res.status(statusCodes.not_acceptable)
                                               .json(responseModel("failed","old and new passwords must be different"));
     //check old password is correct or not 
     bcrypt.compare(oldPassword,DBpassword)
           .then(async (result)=>{
               console.log(result)
                if(result){
                    // update with new password
                    let hash = await bcrypt.hash(newPassword,10);
                    console.log(hash)
                    userModel.findByIdAndUpdate(userID,{password:hash})
                             .then(()=>{
                                 res.status(statusCodes.ok)
                                    .json(responseModel("success","password updated")); 
                             }).catch((err)=>{
                                res.status(statusCodes.internal_server_error).json(responseModel("error",err+""));
                             })
                   
                }
                else{
                    return res.status(statusCodes.unauthorized)
                              .json(responseModel("failed","invalid old password"));
                }
           }).catch((err)=>{
                 res.status(statusCodes.internal_server_error).json(responseModel("error",err+""));
           })
 

}

exports.userList = (req,res) =>{
    let userType = req.query.userType;
    let message;

    if(userType == "admin"){
        userType = "ROLE_ADMIN" ;
        message = "admins"
    } 

    if(userType == "donor"){
        userType = "ROLE_DONOR" ;
        message = "donors"
    } 
   
   
    userModel.find({userType:userType},"name phone status areaCommittee")
             .then((result)=>{
                   message = result.length <= 0 ?`no ${message} found`:message;
                   res.status(statusCodes.ok)
                      .json(responseModel("success",message,{message:result}));
              })
             .catch((err)=>{
                res.status(statusCodes.internal_server_error).json(responseModel("error",err+""));
             })

}

exports.deleteUser = (req,res) => {
    let userId = req.params.userId;
    userModel.findOneAndRemove({_id:`${userId}`})
             .then((user)=>{
                 if(!user) return res.status(statusCodes.not_found)
                                     .json(responseModel("error","user not found"))
               
                res.status(statusCodes.ok)
                   .json(responseModel("success","deleted admin"));
             })
             .catch((err)=>{
                res.status(statusCodes.internal_server_error).json(responseModel("error",err+""));
             })

}





function generateToken(_user,_envVariable,_time){
    if(_time) return jwt.sign(_user,_envVariable,{expiresIn:_time});
    return jwt.sign(_user,_envVariable);
}
