const responseModel=(status="success",message="OK",data=null)=>{
    //status -success or failed or error
    return {
        status:status,
        message:message,
        data:data}
}
module.exports=responseModel;