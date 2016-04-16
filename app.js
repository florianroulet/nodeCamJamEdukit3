"use strict";

var http = require('http');
var fs = require('fs');
var gpio = require('rpi-gpio');
var async = require('async');
var ON_DEATH = require('death');
var dispatcher = require('httpdispatcher');
var io = require('socket.io').listen(server);
var spawn = require("child_process").spawn;

// starting wiimote process
var pythonProcess = spawn('python', ['wii_remote_CamJam.py']);

// Chargement du fichier index.html affiché au client
var server = http.createServer(function (req, res) {
    try {
        console.log(req.url);
        dispatcher.dispatch(req, res);
    } catch (err) {
        console.log(err);
    }

});

dispatcher.onGet("/index.html", function (req, res) {
    fs.readFile('index.html', 'utf-8', function (error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });

});

dispatcher.onGet("/forward", function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
	forward(thenStop);
    res.end("going straight forward !");
});

dispatcher.onGet("/backward", function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
	backward(thenStop);
    res.end("going straight forward !");
});

dispatcher.onGet("/stop", function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
	stop();
    res.end("All engines stopped !");
});

dispatcher.onGet("/left", function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
	left(thenStop);
    res.end("going straight forward !");
});

dispatcher.onGet("/right", function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
	right(thenStop);
    res.end("going straight forward !");
});

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
    socket.emit('connection', 'Vous êtes bien connecté !')

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
});

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
    command({
        "19": {"value": false},
        "21": {"value": false},
        "24": {"value": false},
        "26": {"value": false},
    }, function(err, results) {
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
        "19": {"value": false},
        "21": {"value": true},
        "24": {"value": false},
        "26": {"value": true},
    }, callBack);
}

function forward(callBack) {
    command({
        "19": {"value": true},
        "21": {"value": false},
        "24": {"value": true},
        "26": {"value": false},
    }, callBack);
}

function right(callBack) {
    command({
        "19": {"value": false},
        "21": {"value": false},
        "24": {"value": true},
        "26": {"value": false},
    }, callBack);
}

function left(callBack) {
    command({
        "19": {"value": true},
        "21": {"value": false},
        "24": {"value": false},
        "26": {"value": false},
    }, callBack);
}

var outputsOff = {
    "19": {"value": false},
    "21": {"value": false},
    "24": {"value": false},
    "26": {"value": false},
};

function command(outputs, callBack) {
    callBack = typeof callBack !== 'undefined' ? callBack : function() {return;}
    async.parallel([
        function(callback) {
            gpio.write(19, outputs["19"].value, callback);
        },
        function(callback) {
            gpio.write(24, outputs["24"].value, callback);
        },
        function(callback) {
            gpio.write(26, outputs["26"].value, callback);
        },
        function(callback) {
            gpio.write(21, outputs["21"].value, callback);
        }
    ], function(err, results) {
        callBack();
    });

}
