"use strict";

var http = require('http');
var fs = require('fs');
var gpio = require('rpi-gpio');
var async = require('async');
var ON_DEATH = require('death');
var dispatcher = require('httpdispatcher');
var io = require('socket.io').listen(server);
var spawn = require("child_process").spawn;
var process = spawn('wii_remote_CamJam.py');

//var PythonShell = require('python-shell');
//
//PythonShell.run('wii_remote_CamJam.py', function (err) {
//  if (err) throw err;
//  console.log('finished');
//});

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
    async.parallel([
        function(callback) {
            gpio.write(19, false, callback);
        },
        function(callback) {
            gpio.write(24, false, callback);
        },
        function(callback) {
            gpio.write(26, false, callback);
        },
        function(callback) {
            gpio.write(21, false, callback);
        }
    ], function(err, results) {
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
    callBack = typeof callBack !== 'undefined' ? callBack : function() {return;}
    async.parallel([
        function(callback) {
            gpio.write(19, false, callback);
        },
        function(callback) {
            gpio.write(24, false, callback);
        },
        function(callback) {
            gpio.write(26, true, callback);
        },
        function(callback) {
            gpio.write(21, true, callback);
        }
    ], function(err, results) {
        callBack();
    });
}

function forward(callBack) {
    callBack = typeof callBack !== 'undefined' ? callBack : function() {return;}
    async.parallel([
        function(callback) {
            gpio.write(21, false, callback);
        },
        function(callback) {
            gpio.write(26, false, callback);
        },
        function(callback) {
            gpio.write(19, true, callback);
        },
        function(callback) {
            gpio.write(24, true, callback);
        }
    ], function(err, results) {
        callBack();
    });
}

function right(callBack) {
    callBack = typeof callBack !== 'undefined' ? callBack : function() {return;}
    async.parallel([
        function(callback) {
            gpio.write(21, false, callback);
        },
        function(callback) {
            gpio.write(26, false, callback);
        },
        function(callback) {
            gpio.write(19, false, callback);
        },
        function(callback) {
            gpio.write(24, true, callback);
        }
    ], function(err, results) {
        callBack();
    });
}

function left(callBack) {
    callBack = typeof callBack !== 'undefined' ? callBack : function() {return;}
    async.parallel([
        function(callback) {
            gpio.write(21, false, callback);
        },
        function(callback) {
            gpio.write(26, false, callback);
        },
        function(callback) {
            gpio.write(19, true, callback);
        },
        function(callback) {
            gpio.write(24, false, callback);
        }
    ], function(err, results) {
        callBack();
    });
}
