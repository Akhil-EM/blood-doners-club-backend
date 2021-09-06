const {  validationResult } = require('express-validator');

//models
const locationModel = require("../models/db/location.model");

const responseModel = require("../models/api/response.model");
const statusCodes = require("../utils/response-code");
const responseCode = require('../utils/response-code');


exports.addLocation = (req,res) => {
     //check for validation errors from service center router 
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         return res.status(statusCodes.not_acceptable)
                   .json(responseModel("failed","validation errors",{errors: errors.array()}))
     }
    
    let location = (req.body.location).toLowerCase(); 

    
    locationModel.findOne({location:location})
                 .then((result)=>{
                     if(result)return res.status(statusCodes.not_acceptable)
                                         .json(responseModel("error","location already added"));

                    let location_model = new locationModel({location:location});
                    location_model.save()
                                  .then(()=>{
                                    res.status(statusCodes.ok)
                                       .json(responseModel("success","new location added"));
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
}

exports.listLocation = (req,res) => {
    locationModel.find({},"location")
                 .then((result)=>{
                    if(result.length <= 0) return  res.status(statusCodes.ok)
                                                      .json(responseModel("success","no locations found"));

                    res.status(statusCodes.ok)
                       .json(responseModel("success","locations",{locations:result}))
                 })
                 .catch((err)=>{
                    res.status(statusCodes.internal_server_error)
                    .json(responseModel("error",err+""));
                 })
}

exports.removeLocation = (req,res) =>{
    let locationId = req.params.locationId;
    locationModel.findByIdAndDelete(`${locationId}`)
                 .then((result)=>{
                     res.status(statusCodes.ok)
                        .json(responseModel("success","location removed"))
                 })
                .catch((err)=>{
                    res.status(statusCodes.internal_server_error)
                    .json(responseModel("error",err+""));
                })
}

exports.updateLocation = (req,res) =>{
    //check for validation errors from service center router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }
    
    let locationId = req.params.locationId;
    let location = req.body.location;
    locationModel.findByIdAndUpdate(`${locationId}`,{location:location})
                 .then((result)=>{
                     res.status(responseCode.ok)
                        .json(responseModel("success","location updated"))

                 })
                 .catch((err)=>{
                    res.status(statusCodes.internal_server_error)
                    .json(responseModel("error",err+""));
                 })
                 
}