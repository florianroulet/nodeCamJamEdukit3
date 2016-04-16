var http = require('http');
var fs = require('fs');
var gpio = require('rpi-gpio');
var async = require('async');
var ON_DEATH = require('death');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./indexNode.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');

    // Quand le serveur reçoit un signal de type "message" du client    
    socket.on('message', function (message) {
        console.log('Un client me parle ! Il me dit : ' + message);
	switch(message) {
	    case "forward":
		forward();
            break;
	    case "backward":
		backward();
            break;
	}
    }); 
});

io.sockets.on('connection', function (socket) {
    socket.emit('message', 'Vous êtes bien connecté !');
});

initGPIO();

server.listen(8080);

//process.on('SIGTERM', stopAll);

//process.on('SIGINT', stopAll);

ON_DEATH(function() {
    gpio.destroy(function() {
        console.log('Closed pins, now exit');
        process.exit(0);
    }); 
});

function stopAll() {
    server.close(function() {
        console.log("shutting down server");
        gpio.destroy(function() {
            console.log('Closed pins, now exit');
        }); 
        process.exit(0);
    });
}

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
    async.series([
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

function backward() {  
    async.series([
        function(callback) {
            putPinHigh(19, false, callback);
        },
        function(callback) {
            putPinHigh(24, false, callback);
        },
        function(callback) {
            putPinHigh(26, true, callback);
        },
        function(callback) {
            putPinHigh(21, true, callback);
        }
    ], function(err, results) {
        console.log('Writes complete, pause then stop pins');
        setTimeout(function() {
            stop();
        }, 100);
    });

    function putPinHigh(pin, value, callback) {
        gpio.write(pin, value, callback);
    }
}

function forward() { 

    async.parallel([
        function(callback) {
            putPinHigh(21, false, callback);
        },
        function(callback) {
            putPinHigh(26, false, callback);
        },
        function(callback) {
            putPinHigh(19, true, callback);
        },
        function(callback) {
            putPinHigh(24, true, callback);
        }
    ], function(err, results) {
        console.log('Writes complete, pause then stop pins');
        setTimeout(function() {
            stop();
        }, 100);
    });

    function putPinHigh(pin, value, callback) {
        gpio.write(pin, value, callback);
    }
}
