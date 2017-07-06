'use strict';

var util = require('util');
var Bot = require('slackbots');

var CamJamBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'camJamBot';

    this.user = null;
    this.db = null;
};

// inherits methods and properties from the Bot constructor
util.inherits(CamJamBot, Bot);


CamJamBot.prototype.run = function () {
    NorrisBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

CamJamBot.prototype._onStart = function () {
    this._loadBotUser();
    this._welcomeMessage();
};

CamJamBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

CamJamBot.prototype._welcomeMessage = function () {
    var params = {
        icon_emoji: ':rocket:',
        as_user: true
    };
    this.postMessageToChannel('general', 'Hello there !', params);
};

CamJamBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromMe(message) &&
        this._isMentioningMe(message)
    ) {
        console.log(data);
    }
};

CamJamBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

CamJamBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

CamJamBot.prototype._isFromMe = function (message) {
    return message.user === this.user.id;
};

CamJamBot.prototype._isMentioningMe = function (message) {
    return message.text.toLowerCase().indexOf('camjam') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};


/**
 * @param {object} data
 */
bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm

});

module.exports = CamJamBot;