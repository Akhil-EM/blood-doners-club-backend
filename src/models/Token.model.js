const MONGOOSE=require('mongoose');

const TOKEN_SCHEMA=MONGOOSE.Schema({token:{type:String,required:true},
                                    userId:{type:String,required:true},
                                    tokenType:{type:String,required:true,
                                        enum: ["AUTH_TOKEN"]},
                            },{timestamps:true});

module.exports =MONGOOSE.Model('tokens',TOKEN_SCHEMA);