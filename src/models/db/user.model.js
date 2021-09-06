const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const userSchema=mongoose.Schema({name:{type:String,required:true},
                                   phone:{type:Number,required:true},
                                   password:{type:String,required:true},
                                   status:{type:String,required:true,enum: ["PENDING", "CONFIRMED"]},
                                   userType:{type:String,required:true,enum: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN","ROLE_DONOR"]},
                                   locality:{type:String},///for normal users
                                   areaCommittee:{type:String,required:true},//// for area committee
                                   },{timestamps:true});
                        
//generate password hash using bcrypt
userSchema.pre('save',async function(next){
    if(!this.isModified("password")) return next();
    const hash=await bcrypt.hash(this.password,10);
    this.password=hash;
    next();
})

module.exports =mongoose.model('users',userSchema);
