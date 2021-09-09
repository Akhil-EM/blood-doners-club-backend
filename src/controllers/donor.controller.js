const {validationResult} = require("express-validator");
const { request_time_out } = require("../utils/response-code");

//models
const donorModel = require("../models/db/donor.model");
const userModel = require("../models/db/user.model");

const responseModel = require("../models/api/response.model");
const statusCodes = require("../utils/response-code");
const responseCode = require('../utils/response-code');

exports.fetchDonor = (req,res) =>{
     //check for validation errors from service center router 

    let place = req.query.place;
    let bloodGroup = (req.params.bloodGroup).toUpperCase();
    console.log(place,bloodGroup);
    
    let searchObj;
    if(place) searchObj = {bloodGroup:bloodGroup,place:place} ;
    if(!place) searchObj ={bloodGroup:bloodGroup};
    
    donorModel.find(searchObj,"_id name place phone bloodGroup")
              .then(result =>{
                   res.status(statusCodes.ok)
                      .json(responseModel("success","donors",result))
              })
              .catch((err)=>{
                    res.status(statusCodes.internal_server_error)
                    .json(responseModel("error s2",err+""));
               })

}

exports.deleteDonor =(req,res) =>{
    
    let donorId = req.params.donorId;
    donorModel.findByIdAndDelete(donorId)
              .then(user =>{
                //   console.log(user)
                  let userId =user.userId;
                  
                  userModel.findByIdAndUpdate(userId,{status:"CONFIRMED"})
                           .then(()=>{
                               res.status(statusCodes.ok)
                                  .json(responseModel("error","donor deleted"));
                           })
                           .catch((err)=>{
                               res.status(statusCodes.internal_server_error)
                                  .json(responseModel("error ",err+""));
                            })
                  
              })
              .catch((err)=>{
                   res.status(statusCodes.internal_server_error)
                      .json(responseModel("error ",err+""));
              })
}