const mongoose=require('mongoose');

const donationHistorySchema=mongoose.Schema({donorId:{type:String,required:true},
                                             donationDate:{type:String,required:true},
                                             nextDonationDate:{type:String,required:true},
                                             },{timestamps:true});

module.exports =mongoose.model('donation_history',donationHistorySchema);