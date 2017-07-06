'use strict';

const util = require('util');
const Bot = require('slackbots');

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
        this.botId = this.user.id;
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
        if (CamJamBot.isMessage(message)
            && CamJamBot.isMessageToChannel(message)
            && !CamJamBot.isFromUser(message, this.botId)
            && this._isMentioningMe(message)
        ) {
            console.log('new message : ', message);
        }
    };

    static isMessage(message){
        return Boolean(message.type === 'message' && message.text);
    }

    static isMessageToChannel(message) {
        return typeof message.channel === 'string' && message.channel[0] === 'C';
    }

    static isFromUser(event, userId) {
        return event.user === userId;
    }

    _isMentioningMe(message) {
        let content = message.content || '';
        return content.toLowerCase().indexOf(this.settings.name) > -1 ||
            content.toLowerCase().indexOf(this.user.name) > -1 ||
            content.toLowerCase().indexOf(this.user.id) > -1;
    };
}

module.exports = CamJamBot;