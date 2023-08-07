const MONGO_URI = "mongodb://mongo:27017/demo1";
let MongoClient = require("mongodb").MongoClient;

let MongoDb = {};

MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, dbconnection) {
 if (err) throw err;
 console.log("mongoDb connected!!");

 MongoDb.Appsecret = dbconnection.db("demo1").collection("app_secret");
 MongoDb.version = dbconnection.db("demo1").collection("video_call_version_table");
 MongoDb.privacypolicy = dbconnection.db("demo1").collection("video_call_privacypolicy");
 MongoDb.installtrack = dbconnection.db("demo1").collection("video_call_installtrack");
 MongoDb.Sku = dbconnection.db("demo1").collection("video_call_sku");
 MongoDb.customAds = dbconnection.db("demo1").collection("advertisement_custom");
 MongoDb.customTaglist = dbconnection.db("demo1").collection("advertisement_custom_taglist");
 MongoDb.Appmaster = dbconnection.db("demo1").collection("app_master");
 MongoDb.Termofuse = dbconnection.db("demo1").collection("video_call_term_of_use");
 MongoDb.appCadStatus = dbconnection.db("demo1").collection("ads_click_reports");
});

module.exports = { MongoDb };
