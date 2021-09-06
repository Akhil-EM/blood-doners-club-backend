const appConfig=require("../../config/app.config");
const healthResponseModel=(message,data)=>{
    let dateTime=new Date();
    let timestamp=new Date().getTime();
    return{
        program:appConfig.program,
        version:appConfig.version,
        release:appConfig.version,
        dateTime:dateTime,
        timestamp:timestamp,
        status:"success",
        code: 200,
        message:"OK",
        data:"The service is healthy"}
}
module.exports=healthResponseModel;