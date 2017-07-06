'use strict';

var util = require('util');
var Bot = require('slackbots');

class CamJamBot extends Bot {

    constructor(settings) {
        super(settings);
        this.settings = settings;
        this.settings.name = settings.name || 'camJamBot';

        this.user = null;
        this.on('start', this._onStart);
        this.on('message', this._onMessage);
    }

    _onStart() {
        this._loadBotUser();
        this._welcomeMessage();
    };

    _loadBotUser() {
        let self = this;
        this.user = this.users.filter(function (user) {
            return user.name === self.name;
        })[0];
        console.log('this.user : ', this.user);
    };

    _welcomeMessage() {
        const params = {
            icon_emoji: ':rocket:'
        };
        this.postMessageToChannel('general', 'Hello there !', params);
    };

    _onMessage(message) {
        console.log('message : ', message);
        if (this._isChatMessage(message) &&
            this._isChannelConversation(message) &&
            !this._isFromMe(message) &&
            this._isMentioningMe(message)
        ) {
            console.log('new message : ', message);
        }
    };

    _isChatMessage(message) {
        return message.type === 'message' && Boolean(message.content);
    };

    _isChannelConversation(message) {
        return typeof message.channel === 'string' &&
            message.channel[0] === 'C';
    };

    _isFromMe(message) {
        return message.user === this.user.id;
    };

    _isMentioningMe(message) {
        return message.text.toLowerCase().indexOf(this.settings.name) > -1 ||
            message.text.toLowerCase().indexOf(this.name) > -1;
    };
}

module.exports = CamJamBot;