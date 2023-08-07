const router = require("express").Router();
const { getAppMasterData, getSku, getCustomApp, getInstallTrack, getPrivacy, getVersionData, getcustomTaglist, customAdsClick, Termofuse } = require("../apifunction.js/video_callfun");
const ConstantMethod = require("../util/ConstantMethod"); // common methods
const constant = require("../util/MongoCollections/video_callCollection"); //Mongo collection object
const cheerio = require("cheerio");
const axios = require("axios");

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

router.post("/scrapData", async function (req, res) {
 const { url } = req.body;
 try {
  const response = await axios.get(url);

  const html = response.data;
  const $ = cheerio.load(html);
  // console.log($("body h1:first-of-type").text());
  const firsth2 = $("body h2:first-of-type").text();

  const title = $("title").text();
  const firstPara = $("body p:first-of-type").text();
  const titles = [];
  const subtitles = [];
  const images = [];

  const metaDescription = $('meta[name="description"]').attr("content");
  const author = $('meta[name="author"]').attr("content");
  const keywords = $('meta[name="keywords"]').attr("content");
  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogDesc = $('meta[property="og:description"]').attr("content");
  const ogImg = $('meta[property="og:image"]').attr("content");

  $("h2").each((index, elem) => {
   let ti = $(elem).text();
   titles.push(ti);
  });

  $("h3").each((index, elem) => {
   let sub = $(elem).text();
   subtitles.push(sub);
  });

  $("img").each((index, elem) => {
   let img = $(elem).attr("src");
   images.push(img);
  });

  return res.json({ title, metaDescription, author, keywords, ogTitle, ogImg, ogDesc });
 } catch (error) {
  console.log(error.message);
 }
});

module.exports = router;
