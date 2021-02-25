#!/usr/bin/env nodejs
var express = require('express');
var axios = require('axios');

var app = express();
app.use(express.static("."));
app.get('/gvypics/pic/*', function(req, res) {
    res.redirect("https://groovymarty.com"+req.url);
});
app.get('/gvypics/vid/*', function(req, res) {
    res.redirect("https://groovymarty.com"+req.url);
});
app.get('/gvypics/*', function(req, res) {
    axios.get("https://groovymarty.com"+req.url)
        .then(resp => {
            res.json(resp.data);
        })
        .catch(err => {
            res.status(err.response.status).end();
        });
});

var portNum = 3000;
app.listen(portNum, function() {
    console.log("Server listening on port "+portNum);
});
