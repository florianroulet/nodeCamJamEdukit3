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
        if (message.type === 'message' && message.text &&

            typeof message.channel === 'string' && message.channel[0] === 'C') {
            console.log('new message : ', message);
        }

        console.log({
            isMessage: CamJamBot.isMessage(message),
            isMessageToChannel: CamJamBot.isMessageToChannel(message),
            isFromUser: CamJamBot.isFromUser(message, this.user.id),
            isMentioningMe: this._isMentioningMe(message)
        });
        if (CamJamBot.isMessage(message)
            && CamJamBot.isMessageToChannel(message)
            && !CamJamBot.isFromUser(message, this.user.id)
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
        let text = message.text || '';
        return text.toLowerCase().indexOf(this.settings.name) > -1 ||
            text.toLowerCase().indexOf(this.user.name) > -1 ||
            text.indexOf(this.user.id) > -1;
    };
}

module.exports = CamJamBot;