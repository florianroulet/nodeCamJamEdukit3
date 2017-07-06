"use strict";

var fs = require('fs');
var ON_DEATH = require('death');

/***************************************** GESTION wiimote ***********************************************************/
// starting wiimote process
var spawn = require("child_process").spawn;
var pythonProcess = spawn('python', ['wii_remote_CamJam.py']);
/***************************************** GESTION wiimote ***********************************************************/

/***************************************** GESTION slackbot **********************************************************/
var Bot = require('slackbots');

// create a bot
var settings = {
    token: '',
    name: 'camjamedukit3'
};
var bot = new Bot(settings);

bot.on('start', function() {
    var params = {
        icon_emoji: ':rocket:'
    };
    bot.postMessageToChannel('some-channel-name', 'Hello channel!', params);
    bot.postMessageToUser('some-username', 'hello bro!', params);
    bot.postMessageToGroup('some-private-group', 'hello group chat!', params);
});

/**
 * @param {object} data
 */
bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
    console.log(data);
});

/***************************************** GESTION slackbot **********************************************************/


/***************************************** GESTION page web **********************************************************/
var app = require('express')();
var http = require('http');

// Chargement du fichier index.html affiché au client
var server = http.Server(app);
//var io = require('socket.io').listen(server);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get("/forward", function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
	forward(thenStop);
    res.end("going straight forward !");
});

app.get("/backward", function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
	backward(thenStop);
    res.end("going straight forward !");
});

app.get("/stop", function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
	stop();
    res.end("All engines stopped !");
});

app.get("/left", function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
	left(thenStop);
    res.end("going straight forward !");
});

app.get("/right", function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
	right(thenStop);
    res.end("going straight forward !");
});
/***************************************** GESTION page web **********************************************************/

/***************************************** GESTION socket ************************************************************/
var socket = require('socket.io-client')('http://roulet.freeboxos.fr/raspi');
socket.on('connect', function(){
    console.log('connected to host');
});

// Quand le serveur reçoit un signal de type "movement" du client
socket.on('movement', function (message) {
    switch(message) {
        case "forward":
        forward(thenStop);
            break;
        case "backward":
        backward(thenStop);
            break;
        case "left":
        left(thenStop);
            break;
        case "right":
        right(thenStop);
            break;
        }
});
/***************************************** GESTION socket ************************************************************/

/***************************************** GESTION gpio **************************************************************/
var gpio = require('rpi-gpio');
var async = require('async');

initGPIO();

server.listen(8080, function () {
    console.log('Server listenning on port 8080');
});

ON_DEATH(function () {
    gpio.destroy(function () {
        console.log('Closed pins, now exit');
        //return;
        process.exit(0);
    });
});

function initGPIO() {
    async.parallel([
        function(callback) {
            gpio.setup(19, gpio.DIR_OUT, callback)
        },
        function(callback) {
            gpio.setup(24, gpio.DIR_OUT, callback)
        },
        function(callback) {
            gpio.setup(26, gpio.DIR_OUT, callback)
        },
        function(callback) {
            gpio.setup(21, gpio.DIR_OUT, callback)
        }
    ], function(err, results) {
        console.log('Pins set up');
        return;
    });
}

function stop() {
    command(outputsOff, function(err, results) {
        console.log('All pins shutdown');
    });
}

function thenStop() {
    console.log('Writes complete, pause then stop pins');
    setTimeout(function() {
        stop();
    }, 100);
}

function backward(callBack) {
    command({
        "19": false,
        "21": true,
        "24": false,
        "26": true
    }, callBack);
}

function forward(callBack) {
    command({
        "19": true,
        "21": false,
        "24": true,
        "26": false
    }, callBack);
}

function right(callBack) {
    command({
        "19": false,
        "21": false,
        "24": true,
        "26": false
    }, callBack);
}

function left(callBack) {
    command({
        "19": true,
        "21": false,
        "24": false,
        "26": false
    }, callBack);
}

var outputsOff = {
    "19": false,
    "21": false,
    "24": false,
    "26": false
};

function command(outputs, callBack) {
    callBack = typeof callBack !== 'undefined' ? callBack : function() {return;}
    async.parallel([
        function(callback) {
            gpio.write(19, outputs["19"], callback);
        },
        function(callback) {
            gpio.write(24, outputs["24"], callback);
        },
        function(callback) {
            gpio.write(26, outputs["26"], callback);
        },
        function(callback) {
            gpio.write(21, outputs["21"], callback);
        }
    ], function(err, results) {
        callBack();
    });

}
/***************************************** GESTION gpio** ************************************************************/
