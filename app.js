"use strict";

var fs = require('fs');

/***************************************** GESTION wiimote ***********************************************************/
// starting wiimote process
var spawn = require("child_process").spawn;
var pythonProcess = spawn('python', ['wii_remote_CamJam.py']);
/***************************************** GESTION wiimote ***********************************************************/

/***************************************** GESTION slackbot **********************************************************/
var CamJamBot = require('./camJamBot');

// create a bot
var bot = new CamJamBot({
    token: process.env.BOT_API_KEY,
    name: 'camjamedukit3'
});

bot.run();

/***************************************** GESTION slackbot **********************************************************/

var CamJamPi = require('./camJamNodePi');
const camJamPi = new CamJamPi();

var StaticWebHandle = require('./staticWebHandle');
var staticWebHandle = new StaticWebHandle({port: process.env.SERVER_PORT});
staticWebHandle.run(camJamPi);

var SocketHandle = require('./socketHandle');
var socketHandle = new SocketHandle({host: process.env.SOCKET_HOST});
socketHandle.run(camJamPi);

