exports.sendResponse=(_resObj,_statusCode,_status,_data)=>{
    _resObj.send(_statusCode).json({status:_status,data:_data})
}