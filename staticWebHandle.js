'use strict';

var app = require('express')();
var http = require('http');


var StaticHandle = function Constructor(settings) {

};

StaticHandle.prototype.run = function (camJamPi) {
    var server = http.Server(app);

    // Chargement du fichier index.html affiché au client
    app.get('/', function(req, res){
        res.sendFile(__dirname + '/index.html');
    });

    app.get("/forward", function (req, res) {
        res.writeHead(200, {"Content-Type": "text/html"});
        camJamPi.forward(camJamPi.thenStop);
        res.end("going straight forward !");
    });

    app.get("/backward", function (req, res) {
        res.writeHead(200, {"Content-Type": "text/html"});
        camJamPi.backward(camJamPi.thenStop);
        res.end("going straight forward !");
    });

    app.get("/stop", function (req, res) {
        res.writeHead(200, {"Content-Type": "text/html"});
        camJamPi.stop();
        res.end("All engines stopped !");
    });

    app.get("/left", function (req, res) {
        res.writeHead(200, {"Content-Type": "text/html"});
        camJamPi.left(camJamPi.thenStop);
        res.end("going straight forward !");
    });

    app.get("/right", function (req, res) {
        res.writeHead(200, {"Content-Type": "text/html"});
        camJamPi.right(camJamPi.thenStop);
        res.end("going straight forward !");
    });

    server.listen(8080, function () {
        console.log('Server listenning on port 8080');
    });

};

module.exports = StaticHandle;