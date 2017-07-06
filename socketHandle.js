var Socket = require('socket.io-client');

var SocketHandle = function Constructor(settings) {
    this.settings = settings;
    this.settings.host = settings.host || 'http://roulet.freeboxos.fr/raspi';
};

SocketHandle.prototype.run = function (camJamPi) {
    socket = Socket(this.settings.host);

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

};

module.exports = SocketHandle;

