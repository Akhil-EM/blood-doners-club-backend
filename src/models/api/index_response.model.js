const appConfig=require("../../config/app.config");
const indexResponseModel=(message,data)=>{
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
        message:message,
        data:data}
}
module.exports=indexResponseModel;