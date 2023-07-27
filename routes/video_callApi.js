const router = require("express").Router();
const { getAppMasterData, getSku, getCustomApp, getInstallTrack, getPrivacy, getVersionData, getcustomTaglist, customAdsClick, Termofuse } = require("../apifunction.js/video_callfun");
const rateLimiter = require("../middlewares/rateLimiter");
const ConstantMethod = require("../util/ConstantMethod"); // common methods
const constant = require("../util/MongoCollections/video_callCollection"); //Mongo collection object

router.post("/api", async function (request, response) {
 const data = request.body;
 const { event_name, code, app_version, id, enable, clickId, app_old_version, date } = data;

 if (data.length > 1e6) {
  return response.end(ConstantMethod.Error("FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUESTS"));
 }

 ConstantMethod.CheckHeader(request, constant, (isValidHeader) => {
  if (!isValidHeader) {
   return response.end(ConstantMethod.Error("Header is missing.."));
  }

  switch (event_name) {
   case "version":
    return getVersionData(code, response);

   case "privacypolicy":
    return getPrivacy(response);

   case "installtrack":
    return getInstallTrack(app_version, app_old_version, response);

   case "term_of_use":
    return Termofuse(response);

   case "appMaster":
    return getAppMasterData(id, enable, response);

   case "CustomInApp":
    return getCustomApp(response);

   case "HtmlTaglist":
    return getcustomTaglist(response);

   case "customAdsClick":
    return customAdsClick(id, clickId, date, response);

   case "sku":
    return getSku(response);

   default:
    return response.status(500).send(ConstantMethod.Invalid());
  }
 });
});

module.exports = router;
