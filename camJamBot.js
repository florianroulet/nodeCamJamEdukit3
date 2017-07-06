'use strict';

var util = require('util');
var Bot = require('slackbots');

class CamJamBot extends Bot {

    constructor(settings) {
        super(settings);
        this.settings = settings;
        this.settings.name = this.settings.name || 'camJamBot';

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
    };

    _welcomeMessage() {
        let params = {
            icon_emoji: ':rocket:',
            as_user: true
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
        return message.type === 'message' && Boolean(message.text);
    };

    _isChannelConversation(message) {
        return typeof message.channel === 'string' &&
            message.channel[0] === 'C';
    };

    _isFromMe(message) {
        return message.user === this.user.id;
    };

    _isMentioningMe(message) {
        return message.text.toLowerCase().indexOf('camjam') > -1 ||
            message.text.toLowerCase().indexOf(this.name) > -1;
    };
}

module.exports = CamJamBot;