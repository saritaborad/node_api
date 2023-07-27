let _this = this;

module.exports.success = function GetSuccess(result) {
 return '{"code":200,"data":' + result + ',"message":"success."}';
};

module.exports.Invalid = function GetError() {
 return '{"code":400,"data":you broke the internet!,"message":"failed."}';
};

module.exports.Error = function GetError(result) {
 return '{"code":204,"data":' + result + ',"message":"failed."}';
};

module.exports.CheckHeader = function (request, constant, callback) {
 if (request.headers.app_secret) {
  constant.MongoDb.Appsecret.find({ _id: request.headers.app_secret }, function (err, res) {
   if (!err && res !== null) {
    callback(true);
   } else {
    callback(null);
   }
  });
 } else {
  callback(null);
 }
};
