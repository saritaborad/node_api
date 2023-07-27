const app = require("express")();
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const { rateLimiter } = require("./middlewares/rateLimiter");
const { socketApis } = require("./apifunction.js/video_callsocket");
const http = require("http").Server(app);
const io = require("socket.io")(http);

var currentConnections = [];
io.on("connection", (socket) => {
 // store socket of current connected user [ZIgMvcpU09A7ksk2AAAB:{client:<Socket_obj>}]
 currentConnections[socket.id] = { client: socket };
 console.log(`socket connected to ${socket.id}`);

 socketApis(socket, currentConnections, io);

 socket.on("disconnect", () => {
  console.log(Object.keys(currentConnections).length + " -- disconnect ! --> " + currentConnections[socket.id].client.id);
  delete currentConnections[socket.id];
 });
});

app.use(bodyParser.json());
// app.use(rateLimit({ windowMs: 3 * 60 * 1000, max: 5, message: "You exceeded 5 request in 3 minutes!", headers: true }));

app.use("/video_call", require("./routes/video_callApi"));

app.get("/posts", rateLimiter, (req, res, next) => {
 res.send("get success!");
});

http.listen("5000", () => {
 console.log("server is listening on", 5000);
});
