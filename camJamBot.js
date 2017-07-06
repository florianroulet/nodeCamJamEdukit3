'use strict';

const util = require('util');
const Bot = require('slackbots');

class CamJamBot extends Bot {

    constructor(settings, camJamPi) {
        super(settings);
        this.settings = settings;
        this.settings.name = settings.name || 'camJamBot';

        this.user = null;
        this.on('start', this._onStart);
        this.on('message', this._onMessage);
        this.camJamPi = camJamPi;
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
        console.log({
            isMessage: CamJamBot.isMessage(message),
            isMessageToChannel: CamJamBot.isMessageToChannel(message),
            isFromUser: CamJamBot.isFromUser(message, this.user.id),
            isMentioningMe: CamJamBot.isMentioningMe(message, this.settings.name, this.user.name, this.user.id)
        });
        if (CamJamBot.isMessage(message)
            && CamJamBot.isMessageToChannel(message)
            && !CamJamBot.isFromUser(message, this.user.id)
            && CamJamBot.isMentioningMe(message, this.settings.name, this.user.name, this.user.id)
        ) {
            console.log('new message : ', message);
            if (message.text.indexOf('f') > -1) {
                this.camJamPi.forward(this.camJamPi.thenStop);
            }
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

    static isMentioningMe(message, settingName, userName, id) {
        let text = message.text || '';
        return text.toLowerCase().indexOf(settingName) > -1 ||
            text.toLowerCase().indexOf(userName) > -1 ||
            text.indexOf(id) > -1;
    };
}

module.exports = CamJamBot;