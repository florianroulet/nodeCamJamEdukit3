"use strict";

var fs = require('fs');
var CamJamPi = require('./camJamNodePi');

const camJamPi = new CamJamPi();

/***************************************** GESTION wiimote ***********************************************************/
// starting wiimote process
var spawn = require("child_process").spawn;
var pythonProcess = spawn('python', ['wii_remote_CamJam.py']);
/***************************************** GESTION wiimote ***********************************************************/

/***************************************** GESTION slackbot **********************************************************
var CamJamBot = require('./camJamBot');

// create a bot
var bot = new CamJamBot({
    token: process.env.BOT_API_KEY,
    name: 'camjamedukit3'
});

bot.run();

/***************************************** GESTION slackbot **********************************************************/
var StaticWebHandle = require('./staticWebHandle');
(new StaticWebHandle).run(camJamPi);

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

