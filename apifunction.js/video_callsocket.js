const ConstantMethod = require("../util/ConstantMethod");
const constant = require("../util/MongoCollections/video_callCollection");
const moment = require("moment");
const { google } = require("googleapis");

const getAppMasterData = (id, enable, socket) => {
 constant.MongoDb.Appmaster.find({ package_name: id, enable: enable }).toArray(function (err, res) {
  if (!err && res !== null) {
   if (res.length > 0) {
    res.forEach((item) => {
     item.date = moment(item.date).format("YYYY-MM-DD HH:mm:ss");
    });
    socket.emit("api_response", ConstantMethod.success(JSON.stringify(res)));
   } else {
    socket.emit("api_response", ConstantMethod.success("Data not found"));
   }
  } else {
   socket.emit("api_response", ConstantMethod.Error(err));
  }
 });
};

const getcustomTaglist = (socket) => {
 constant.MongoDb.customTaglist
  .find()
  .sort({ order: 1 })
  .toArray(function (err, res) {
   if (!err && res !== null) {
    socket.emit("api_response", ConstantMethod.success(JSON.stringify(res)));
   } else {
    socket.emit("api_response", ConstantMethod.Error(err));
   }
  });
};

const getSku = (socket) => {
 constant.MongoDb.Sku.find().toArray(function (err, res) {
  if (!err && res !== null) {
   socket.emit("api_response", ConstantMethod.success(JSON.stringify(res)));
  } else {
   socket.emit("api_response", ConstantMethod.Error(err));
  }
 });
};

const getCustomApp = (socket) => {
 constant.MongoDb.customAds.find().toArray(function (err, res) {
  if (!err && res !== null) {
   if (res.length > 0) {
    res.forEach((item) => {
     item.date = moment(item.date).format("YYYY-MM-DD HH:mm:ss");
     item.advertisement_custom_multi.forEach((item1) => {
      item1.date = moment(item.date).format("YYYY-MM-DD HH:mm:ss");
     });
    });

    socket.emit("api_response", ConstantMethod.success(JSON.stringify(res)));
   } else {
    socket.emit("api_response", ConstantMethod.success("Data not found!"));
   }
  } else {
   socket.emit("api_response", ConstantMethod.Error(err));
  }
 });
};

const getInstallTrack = (app_version, app_old_version, socket) => {
 constant.MongoDb.version.findOne({ code: parseInt(app_version) }, function (err, res) {
  if (!err && res !== null) {
   if (app_version != app_old_version) {
    let batch = constant.MongoDb.version.initializeUnorderedBulkOp({ useLegacyOps: true });
    batch.find({ code: parseInt(app_old_version) }).updateOne({ $inc: { users: -1 } });
    batch.find({ code: parseInt(app_version) }).updateOne({ $inc: { users: 1 } });
    batch.execute(function (err, res) {
     if (!err) {
      socket.emit("api_response", ConstantMethod.success("done"));
     } else {
      socket.emit("api_response", ConstantMethod.Error(err));
     }
    });
   } else {
    let batch = constant.MongoDb.version.initializeUnorderedBulkOp({ useLegacyOps: true });
    batch.find({ code: parseInt(app_version) }).updateOne({ $inc: { users: 1 } });
    batch.execute(function (err, res) {
     if (!err) {
      socket.emit("api_response", ConstantMethod.success("done"));
     } else {
      socket.emit("api_response", ConstantMethod.Error(err));
     }
    });
   }
  } else {
   socket.emit("api_response", ConstantMethod.Error(err));
  }
 });
};

const getPrivacy = (socket) => {
 constant.MongoDb.privacypolicy.findOne(function (err, res) {
  if (!err && res !== null) {
   res.date = moment(res.date).format("YYYY-MM-DD HH:mm:ss");
   socket.emit("api_response", ConstantMethod.success(JSON.stringify(res)));
  } else {
   socket.emit("api_response", ConstantMethod.Error(err));
  }
 });
};

const getVersionData = (code, socket, connectedUsers) => {
 connectedUsers[socket.id].version_code = code;
 constant.MongoDb.version.findOne({ code: code }, function (err, res) {
  if (!err && res !== null) {
   connectedUsers[socket.id].ad_data = res;
   res.date = moment(res.date).format("YYYY-MM-DD HH:mm:ss");
   res.ad_master.forEach((item) => {
    item.adm_date = moment(item.adm_date).format("YYYY-MM-DD HH:mm:ss");
    item.ad_chield.forEach((item1) => {
     item1.adc_date = moment(item.adc_date).format("YYYY-MM-DD HH:mm:ss");
    });
   });
   socket.emit("api_response", ConstantMethod.success(JSON.stringify(res)));
  } else {
   socket.emit("api_response", ConstantMethod.Error(err));
  }
 });
};

const customAdsClick = (id, clickId, date, socket) => {
 constant.MongoDb.appCadStatus.updateOne(
  { apid: id, cad_id: clickId, date: date },
  { $set: { apid: id, cad_id: clickId, date: date }, $inc: { count: 1 } },
  {
   upsert: true,
  },
  function (err, res) {
   if (!err) {
    socket.emit("api_response", ConstantMethod.success(JSON.stringify("Custom ads click inserted")));
   } else {
    socket.emit("api_response", ConstantMethod.Error(err));
   }
  }
 );
};

const Termofuse = (socket) => {
 constant.MongoDb.Termofuse.findOne(function (err, res) {
  if (!err && res !== null) {
   res.date = moment(res.date).format("YYYY-MM-DD HH:mm:ss");
   socket.emit("api_response", ConstantMethod.success(JSON.stringify(res)));
  } else {
   socket.emit("api_response", ConstantMethod.Error(err));
  }
 });
};

const verifyUser = (data, socket) => {
 google.auth
  .getClient({
   credentials: { client_email: "abc@name.com", private_key: "dweeeeeeeeeeeeeeeeeeeecdfse" },
   scopes: ["https://www.googleapis.com/auth/androidpublisher"],
  })
  .then((client) => {
   const androidPublisher = google.androidpublisher({ version: "v3", auth: client });
   androidPublisher.purchases.subscriptionsv2
    .get({ packageName: data.packageName, token: data.token })
    .then((data) => {
     socket.emit("api_response", ConstantMethod.success(data.data));
    })
    .catch((err) => {
     socket.emit("api_response", ConstantMethod.Error(err));
    });
  });
};

const countryFlag = (socket) => {
 constant.MongoDb.country_flag.find().toArray(function (err, res) {
  if (!err && res != null) {
   socket.emit("api_response", ConstantMethod.success(JSON.stringify(res)));
  } else {
   socket.emit("api_response", ConstantMethod.Error(err));
  }
 });
};

const currancyData = (socket) => {
 constant.MongoDb.currancydata.find().toArray(function (err, res) {
  if (!err && res != null) {
   socket.emit("api_response", ConstantMethod.success(JSON.stringify(res)));
  } else {
   socket.emit("api_response", ConstantMethod.Error(err));
  }
 });
};

const socketApis = (socket, connectedUsers) => {
 socket.on("api_request", (data) => {
  const { event_name, code, app_old_version, app_version, id, enable, clickId, date } = data;

  if (data.length > 1e6) {
   return socket.emit("api_response", ConstantMethod.Error("FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST"));
  }

  ConstantMethod.CheckHeader(socket.request, constant, function (isValidHeader) {
   if (!isValidHeader) {
    return socket.emit("api_response", ConstantMethod.Error("Header is missing"));
   }

   switch (event_name) {
    case "version":
     return getVersionData(code, socket, connectedUsers);

    case "privacypolicy":
     return getPrivacy(socket);

    case "installtrack":
     return getInstallTrack(app_version, app_old_version, socket);

    case "term_of_use":
     return Termofuse(socket);

    case "appMaster":
     return getAppMasterData(id, enable, socket);

    case "CustomInApp":
     return getCustomApp(socket);

    case "HtmlTaglist":
     return getcustomTaglist(socket);

    case "customAdsClick":
     return customAdsClick(id, clickId, date, socket);

    case "sku":
     return getSku(socket);

    case "verify_user":
     return verifyUser(data, socket);

    case "country_flag":
     return countryFlag(socket);

    case "currancydata":
     return currancyData(data, socket);

    default:
     return socket.emit("api_response", ConstantMethod.Invalid());
   }
  });
 });
};

module.exports = { getAppMasterData, getcustomTaglist, getSku, getCustomApp, getInstallTrack, getPrivacy, getVersionData, customAdsClick, Termofuse, socketApis };
