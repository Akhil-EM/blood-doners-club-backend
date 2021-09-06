const mongoose=require('mongoose');

const locationSchema=mongoose.Schema({location:{type:String,required:true}
                                      },{timestamps:true});

module.exports =mongoose.model('locations',locationSchema);