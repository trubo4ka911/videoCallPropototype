// where create the express and socket.io server

const fs = require("fs");
const https = require("https");
const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const app = express();
app.use(cors()); //this will open Express API to ANY domain
app.use(express.static(__dirname + "/public"));
app.use(express.json()); //this will allow to parse json in the body with the body parser

const key = fs.readFileSync("./certs/cert.key");
const cert = fs.readFileSync("./certs/cert.crt");

const expressServer = https.createServer({ key, cert }, app);
const io = socketio(expressServer, {
  cors: [
    "https://localhost:3003",
    "https://localhost:3004",
    "https://localhost:3005",
  ],
});

expressServer.listen(9001);
module.exports = { io, expressServer, app };
