const ConstantMethod = require("../util/ConstantMethod");
const constant = require("../util/MongoCollections/video_callCollection");
const moment = require("moment");

const getAppMasterData = (id, enable, response) => {
 constant.MongoDb.Appmaster.find({ package_name: id, enable: enable }).toArray(function (err, res) {
  if (!err && res !== null) {
   if (res.length > 0) {
    res.forEach((item) => {
     item.date = moment(item.date).format("YYYY-MM-DD HH:mm:ss");
    });
    response.end(ConstantMethod.success(JSON.stringify(res)));
   } else {
    response.status(404).send(ConstantMethod.success("Data not found..."));
   }
  } else {
   response.status(500).send(ConstantMethod.Error(err));
  }
 });
};

const getcustomTaglist = (response) => {
 constant.MongoDb.customTaglist
  .find()
  .sort({ order: 1 })
  .toArray(function (err, res) {
   if (!err && res !== null) {
    response.end(ConstantMethod.success(JSON.stringify(res)));
   } else {
    response.status(500).send(ConstantMethod.Error(err));
   }
  });
};

const getSku = (response) => {
 constant.MongoDb.Sku.find().toArray(function (err, res) {
  if (!err && res !== null) {
   response.end(ConstantMethod.success(JSON.stringify(res)));
  } else {
   response.status(500).send(ConstantMethod.Error(err));
  }
 });
};

const getCustomApp = (response) => {
 constant.MongoDb.customAds.find().toArray(function (err, res) {
  if (!err && res !== null) {
   if (res.length > 0) {
    res.forEach((item) => {
     item.date = moment(item.date).format("YYYY-MM-DD HH:mm:ss");
     item.advertisement_custom_multi.forEach((item1) => {
      item1.date = moment(item.date).format("YYYY-MM-DD HH:mm:ss");
     });
    });
    response.end(ConstantMethod.success(JSON.stringify(res)));
   } else {
    response.status(404).send(ConstantMethod.success("Data not found!"));
   }
  } else {
   response.status(500).send(ConstantMethod.Error(err));
  }
 });
};

const getInstallTrack = (app_version, app_old_version, response) => {
 constant.MongoDb.version.findOne({ code: parseInt(app_version) }, function (err, res) {
  if (!err && res !== null) {
   if (app_version != app_old_version) {
    let batch = constant.MongoDb.version.initializeUnorderedBulkOp({ useLegacyOps: true });
    batch.find({ code: parseInt(app_old_version) }).updateOne({ $inc: { users: -1 } });
    batch.find({ code: parseInt(app_version) }).updateOne({ $inc: { users: 1 } });
    batch.execute(function (err, res) {
     if (!err) {
      response.send(ConstantMethod.success("done"));
     } else {
      response.status(500).send(ConstantMethod.Error(err));
     }
    });
   } else {
    let batch = constant.MongoDb.version.initializeUnorderedBulkOp({ useLegacyOps: true });
    batch.find({ code: parseInt(app_version) }).updateOne({ $inc: { users: 1 } });
    batch.execute(function (err, res) {
     if (!err) {
      response.end(ConstantMethod.success("done"));
     } else {
      response.status(500).send(ConstantMethod.Error(err));
     }
    });
   }
  } else {
   response.status(500).send(ConstantMethod.Error(err));
  }
 });
};

const getPrivacy = (response) => {
 constant.MongoDb.privacypolicy.findOne(function (err, res) {
  if (!err && res !== null) {
   res.date = moment(res.date).format("YYYY-MM-DD HH:mm:ss");
   response.end(ConstantMethod.success(JSON.stringify(res)));
  } else {
   response.status(500).send(ConstantMethod.Error(err));
  }
 });
};

const getVersionData = (code, response) => {
 constant.MongoDb.version.findOne({ code: code }, function (err, res) {
  if (!err && res !== null) {
   res.date = moment(res.date).format("YYYY-MM-DD HH:mm:ss");
   res.ad_master.forEach((item) => {
    item.adm_date = moment(item.adm_date).format("YYYY-MM-DD HH:mm:ss");
    item.ad_chield.forEach((item1) => {
     item1.adc_date = moment(item.adc_date).format("YYYY-MM-DD HH:mm:ss");
    });
   });
   response.end(ConstantMethod.success(JSON.stringify(res)));
  } else {
   response.status(500).send(ConstantMethod.Error(err));
  }
 });
};

const customAdsClick = (id, clickId, date, response) => {
 constant.MongoDb.appCadStatus.updateOne(
  { apid: id, cad_id: clickId, date: date },
  { $set: { apid: id, cad_id: clickId, date: date }, $inc: { count: 1 } },
  {
   upsert: true,
  },
  function (err, res) {
   if (!err) {
    response.end(ConstantMethod.success(JSON.stringify("Custom ads click inserted")));
   } else {
    response.status(500).send(ConstantMethod.Error(err));
   }
  }
 );
};

const Termofuse = (response) => {
 constant.MongoDb.Termofuse.findOne(function (err, res) {
  if (!err && res !== null) {
   res.date = moment(res.date).format("YYYY-MM-DD HH:mm:ss");
   response.end(ConstantMethod.success(JSON.stringify(res)));
  } else {
   response.status(500).send(ConstantMethod.Error(err));
  }
 });
};

module.exports = { getAppMasterData, getcustomTaglist, getSku, getCustomApp, getInstallTrack, getPrivacy, getVersionData, customAdsClick, Termofuse };
