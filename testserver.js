#!/usr/bin/env nodejs
var express = require('express');

var app = express();
app.use(express.static("."));

var portNum = 3000;
app.listen(portNum, function() {
  console.log("Server listening on port "+portNum);
});
