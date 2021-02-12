#!/usr/bin/env nodejs
var express = require('express');
var axios = require('axios');

var app = express();
app.use(express.static("."));
app.get('/gvypics/pic/*', function(req, res) {
  res.redirect("https://groovymarty.com"+req.path);
});
app.get('/gvypics/vid/*', function(req, res) {
  res.redirect("https://groovymarty.com"+req.path);
});
app.get('/gvypics/ls/*', function(req, res, next) {
  axios.get("https://groovymarty.com"+req.path)
    .then(resp => res.json(resp.data))
    .catch(err => next(err));
});

var portNum = 3000;
app.listen(portNum, function() {
  console.log("Server listening on port "+portNum);
});
