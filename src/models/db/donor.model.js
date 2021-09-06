const mongoose=require('mongoose');

const donorSchema=mongoose.Schema({userId:{type:String,required:true},
                                   name:{type:String,required:true},
                                   place:{type:String,required:true},
                                   phone:{type:Number,required:true},
                                   bloodGroup:{type:String,required:true,
                                         enum: ["A+VE","A-VE","B+VE","B-VE","O+VE","O-VE","AB+VE","AB-VE"]}},
                                   {timestamps:true});

module.exports =mongoose.model('donors',donorSchema);