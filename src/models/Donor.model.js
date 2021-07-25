const MONGOOSE=require('mongoose');
const BCRYPT=require('bcrypt');

const DONOR_SCHEMA=MONGOOSE.Schema({name:{type:String,required:true},
                                    place:{type:String,required:true},
                                    phone:{type:Number,required:true},
                                    bloodGroup:{type:String,required:true,
                                        enum: ["A+VE","A-VE","B+VE","B-VE","O+VE","O-VE","AB+VE","AB-VE"]}},
                                    {timestamps:true});

module.exports =MONGOOSE.Model('donors',DONOR_SCHEMA);