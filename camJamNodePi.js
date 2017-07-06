
/***************************************** GESTION gpio **************************************************************/

var gpio = require('rpi-gpio');
var async = require('async');
var ON_DEATH = require('death');


var CamJamPi = function Constructor() {
    _initGPIO();
};

CamJamPi.prototype.thenStop = function() {
    console.log('Writes complete, pause then stop pins');
    setTimeout(function() {
        _command(outputsOff, function(err, results) {
            console.log('All pins shutdown');
        });
    }, 100);
};

CamJamPi.prototype.stop = function() {
    _command(outputsOff, function(err, results) {
        console.log('All pins shutdown');
    });
};

CamJamPi.prototype.backward = function(callBack) {
    _command({
        "19": false,
        "21": true,
        "24": false,
        "26": true
    }, callBack);
};

CamJamPi.prototype.forward = function(callBack) {
    _command({
        "19": true,
        "21": false,
        "24": true,
        "26": false
    }, callBack);
};

CamJamPi.prototype.right = function(callBack) {
    _command({
        "19": false,
        "21": false,
        "24": true,
        "26": false
    }, callBack);
};

CamJamPi.prototype.left = function(callBack) {
    _command({
        "19": true,
        "21": false,
        "24": false,
        "26": false
    }, callBack);
};

module.exports = CamJamPi;


ON_DEATH(function () {
    gpio.destroy(function () {
        console.log('Closed pins, now exit');
        //return;
        process.exit(0);
    });
});

function _initGPIO() {
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

var outputsOff = {
    "19": false,
    "21": false,
    "24": false,
    "26": false
};

function _command(outputs, callBack) {
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
