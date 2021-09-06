require('dotenv').config();
const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const morgan = require("morgan");

const port=process.env.PORT;
const app=express();
const mongoDB=mongoose.connection;

//api response models
const indexResponseModel=require('./src/models/api/index_response.model');
const healthResponseModel=require('./src/models/api/health_response.model');
const responseModel = require("./src/models/api/response.model");
const statusCodes = require("./src/utils/response-code");

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(morgan('tiny'));//logs request-endpoint and time taken

mongoose.Promise=global.Promise;
mongoose.connect(process.env.DATABASE_URL,{
                 useNewUrlParser:true,
                 useFindAndModify:false,
                 useCreateIndex:true,
                 useUnifiedTopology:true});
mongoDB.on('error',error=>console.log('\n mongodb connection error '+error));
mongoDB.once('open',()=>console.log('connected to mongodb'));

//index router
app.get('/', function (req, res) {
    const routers=[
          {
            method:"GET",
            path:"/",
            description:"api end points list"
          },
          {
            method:"GET",
            path:"/status",
            description:"check service health"
          },
          {
            method:"POST",
            path:"/user/admin",
            description:"register a new admin"
          },
          {
            method:"POST",
            path:"/user/donor",
            description:"register a new donor"
          },
          {
            method:"GET",
            path:"/user",
            description:"get list of admin or donor",
            query:"admin donor"
          },
          {
            method:"DELETE",
            path:"/user",
            description:"delete a user ",
            params:"user id"
          },
          {
            method:"POST",
            path:"/location",
            description:"add new location",
            body:"location"
          },
          {
            method:"GET",
            path:"/location",
            description:"get list of locations",
          },
          {
            method:"DELETE",
            path:"/location",
            description:"delete a location from list",
            params:"locationId"
          },
          {
            method:"PUT",
            path:"/location",
            description:"edit particular location",
            params:"locationId",
            body:"location"
          }]
    res.status(statusCodes.ok);
    res.json(indexResponseModel("OK",routers));
    res.end();
});

app.get('/status',(req,res)=>{
    res.status(statusCodes.ok);
    res.json(healthResponseModel());
    res.end();
})
  
app.use('/user',require('./src/routers/user.router'));
app.use('/location',require("./src/routers/location.router"));

//no end points exist 
app.all('*',(req,res)=>{
  res.status(404);
  res.json(responseModel('failed',"no endpoint found",null));
})

app.listen(port,()=>console.log(`\napplication is running at ${port}`))