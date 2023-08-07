// const moment = require("moment");
// let MongoClient = require("mongodb").MongoClient;
// const geoip = require("geoip-lite");

// let collection;
// const MONGO_URI = "mongodb://0.0.0.0:27017";
// const MONGO_DB_NAME = "rate_limiter";
// const MONGO_COLLECTION_NAME = "requests";

// const WINDOW_DURATION_IN_MINUTES = 1;
// const MAX_WINDOW_REQUEST_COUNT = 5;
// const WINDOW_LOG_DURATION_IN_MINUTES = 1;

// MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, dbconnection) {
//  if (err) throw err;
//  collection = dbconnection.db(MONGO_DB_NAME).collection(MONGO_COLLECTION_NAME);
// });

// const getGeolocation = (ipaddress) => {
//  const geo = geoip.lookup(ipaddress);
//  return geo;
// };

// const rateLimiter = async (req, res, next) => {
//  try {
//   const currentTime = moment();

//   // window begin time
//   const windowBeginTimestamp = moment().subtract(WINDOW_DURATION_IN_MINUTES, "minutes").unix();
//   // timestamp will represent the start of log window, used for filtering data within this time range or performing time-based operations

//   const windowLogTimestamp = moment().subtract(WINDOW_LOG_DURATION_IN_MINUTES, "minutes").unix();

//   // find the ip if exist
//   let record = await collection.findOne({ ip: req.ip });

//   // if not exists create new record
//   if (!record) {
//    record = {
//     ip: req.ip,
//     requests: [],
//    };
//   }

//   // it will keep only request that occured after beginning of specified time in window
//   const requestsInWindow = record.requests.filter((entry) => entry.requestTimeStamp > windowBeginTimestamp);
//   const totalWindowRequestsCount = requestsInWindow.reduce((accumulator, entry) => accumulator + entry.requestCount, 0);

//   // check if total request is greater than max request
//   if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
//    return res.status(429).json({
//     error: `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_DURATION_IN_MINUTES} minutes limit!`,
//    });
//   }
//   // it will fetch last request element from record request array => last recorded request
//   const lastRequestLog = record.requests[record.requests.length - 1];
//   //if last recorded request is within the current log window then increment count

//   // checks if the last recorded request is within the current log window (occurred after the windowLogTimestamp)
//   if (lastRequestLog && lastRequestLog.requestTimeStamp > windowLogTimestamp) {
//    lastRequestLog.requestCount++;
//   } else {
//    // if the last recorded request is not within current window then add new entry with current timestamp to record
//    record.requests.push({
//     requestTimeStamp: currentTime.unix(),
//     requestCount: 1,
//    });
//   }

//   await collection.updateOne({ ip: req.ip }, { $set: { requests: record.requests } }, { upsert: true });
//   next();
//  } catch (error) {
//   next(error);
//  }
// };

// const userRateLimiter = async (req, res, next) => {
//  try {
//   let userIdentifier = 1;
//   const currentTime = moment();
//   const windowBeginTimestamp = moment().subtract(WINDOW_DURATION_IN_MINUTES, "minutes").unix();
//   const windowLogTimestamp = moment().subtract(WINDOW_LOG_DURATION_IN_MINUTES, "minutes").unix();

//   let record = await collection.findOne({ userIdentifier: userIdentifier });

//   if (!record) {
//    record = {
//     userIdentifier: userIdentifier,
//     requests: [],
//    };
//   }

//   const requestsInWindow = record.requests.filter((entry) => entry.requestTimeStamp > windowBeginTimestamp);
//   const totalWindowRequestsCount = requestsInWindow.reduce((accumulator, entry) => accumulator + entry.requestCount, 0);

//   if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
//    return res.status(429).json({
//     error: `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_DURATION_IN_MINUTES} minutes limit!`,
//    });
//   }

//   const lastRequestLog = record.requests[record.requests.length - 1];
//   if (lastRequestLog && lastRequestLog.requestTimeStamp > windowLogTimestamp) {
//    lastRequestLog.requestCount++;
//   } else {
//    record.requests.push({
//     requestTimeStamp: currentTime.unix(),
//     requestCount: 1,
//    });
//   }

//   await collection.updateOne({ userIdentifier: userIdentifier }, { $set: { requests: record.requests } }, { upsert: true });
//   next();
//  } catch (error) {
//   next(error);
//  }
// };

// const locationRateLimiter = async (req, res, next) => {
//  try {
//   const currentTime = moment();
//   const windowBeginTimestamp = moment().subtract(WINDOW_DURATION_IN_MINUTES, "minutes").unix();
//   const windowLogTimestamp = moment().subtract(WINDOW_LOG_DURATION_IN_MINUTES, "minutes").unix();

//   // Use IP geolocation service or library to determine the geographic location based on the clientIP
//   const location = getGeolocation("51.217.224.35"); // Implement your own function to fetch the geolocation data

//   if (isRateLimited(location)) {
//    return res.status(429).json({ error: "Rate limit exceeded for the location." });
//   }

//   next();
//  } catch (error) {
//   next(error);
//  }
// };

// const isRateLimited = (location) => {
//  if (location && location.country === "GB") {
//   const maxRequestsPerMinute = 5;
//   const currentRequestCount = getCurrentRequestCount(location);
//   // if the count is greater than max request return true
//   if (currentRequestCount >= maxRequestsPerMinute) {
//    return true;
//   }
//  }

//  return false;
// };

// const getCurrentRequestCount = (location) => {
//  const requestCountsByLocation = {
//   US: 50,
//   GB: 6,
//   DE: 90,
//  };

//  const countryCode = location.country;
//  return requestCountsByLocation[countryCode] || 0;
// };

// module.exports = { rateLimiter, locationRateLimiter, userRateLimiter };
