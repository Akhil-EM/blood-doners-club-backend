require('dotenv').config();

const {body,validationResult} =require('express-validator');
const BCRYPT=require('bcrypt');
const JWT=require('jsonwebtoken');

const USER_MODEL=require('../models/User.model');
const TOKEN_MODEL=require('../models/Token.model');
const RESPONSE_OBJ=require('../common/ResponseFormat')



exports.registerUser=(req,res,next)=>{
      
    const ERRORS=validationResult(req);
    if(!ERRORS.isEmpty()) return RESPONSE_OBJ.sendResponse(res,400,'error',ERRORS);

    let userType=(req.body.userType).trim();
    let name=(req.body.name).trim();
    let phone=(req.body.phone).trim();
    let password=(req.body.password).trim();
    let committeeName=(req.body.committeeName).trim();

    USER_MODEL.findOne
}
