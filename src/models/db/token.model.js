const mongoose=require('mongoose');

const tokenSchema=mongoose.Schema({token:{type:String,required:true},
                                //     userId:{type:String,required:true},
                                    tokenType:{type:String,required:true,
                                                 enum: ["AUTH_TOKEN"]},
                            },{timestamps:true});

module.exports =mongoose.model('tokens',tokenSchema);