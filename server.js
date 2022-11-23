//app inside import
const db = require("./app/config/db.connect.js");

const db_uberrecord = require("./app/uber_record/index.js");
const RideRecord = db_uberrecord.uber_ride;
//libs import
const express = require('express');
const cors = require("cors");
const app = express();
const ws = require('ws');
const SERVER_PORT = 8081; //process.env.PORT || 8080;
const SOCKET_PORT = 3081;  
 
var corsOptions = { origin: `http://localhost:${SERVER_PORT}` };

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */

// stop app to close once crash found
process.on('uncaughtException', function (error) {
  console.log(error.stack);
});
//--------------------------------------------DB CONNECTION--------------------------------------------//
 
db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

//--------------------------------------------HTTP CONNECTION--------------------------------------------//
// simple route
app.get("/", (req, res) => {res.json({ message: "Welcome to bezkoder application." });});

require("./app/account/url")(app);
require("./app/uber_record/url")(app);
// require("./app/urls/turorial.url")(app);

// set port, listen for requests
 
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}.`);
}); 

//----------------------------------------WEB_SOCKETS CONNECTION------------------------------------------//
const wsServer = new ws.Server({ noServer: true });
activeWebSockets = { }//{socketID:userActualId}
wsServer.on('connection', (socket,request) => {
  var userID = request.url.split('?')[1]
  activeWebSockets[userID.toString()] = socket
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(activeWebSockets))

  socket.on('close', () => {
    delete activeWebSockets[userID]; 
    console.log('User disconnected received on server.')
  });
  socket.on('message', (message)=>{ 
    console.log(message.toString())
  });
  //send db messages data 
  RideRecord.find( {"rider": { "_id" : userID }})
  .then(_rideRecord => {
    if (_rideRecord)
    socket.send(JSON.stringify({"data": _rideRecord}));
  })
  .catch(err => {
    socket.send(JSON.stringify({"data": []}));
  }); 

});
const server = app.listen(SOCKET_PORT);
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});

module.exports.activeWebSockets = activeWebSockets