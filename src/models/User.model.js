const MONGOOSE=require('mongoose');
const BCRYPT=require('bcrypt');

const USER_SCHEMA=MONGOOSE.Schema({name:{type:String,required:true},
                                   phone:{type:Number,required:true},
                                   password:{type:String,required:true},
                                   committeeName:{type:String,required:true},
                                   userType:{type:String,required:true,enum: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]}
                                    },{timestamps:true});
                        
//generate password hash using bcrypt
USER_SCHEMA.pre('save',async next=>{
    if(!this.isModified("password")) return next();
    const HASH=await BCRYPT.hash(this.password,10);
    this.password=HASH;
    next();
})

module.exports =MONGOOSE.Model('users',USER_SCHEMA);
