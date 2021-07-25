require('dotenv').config();
const EXPRESS=require('express');
const CORS=require('cors');
const MONGOOSE=require('mongoose');

const PORT=process.env.PORT || 3000;
const APP=EXPRESS();
const MONGO_DB=MONGOOSE.connection;

APP.use(EXPRESS.json());
APP.use(CORS());
MONGOOSE.Promise=global.Promise;

MONGOOSE.connect(process.env.DATABASE_URL,{
                 useNewUrlParser:true,
                 useFindAndModify:false,
                 useCreateIndex:true,
                 useUnifiedTopology:true});
MONGO_DB.on('error',error=>console.log('\n mongodb connection error '+error));
MONGO_DB.once('open',()=>console.log('connected to mongodb'));

APP.get('/',(req,res)=>{
    res.status(200).json({status:'success',data:''});
})



APP.listen(PORT,()=>console.log(`\napplication is running at ${PORT}`))