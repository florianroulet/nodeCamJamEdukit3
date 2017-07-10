'use strict';

const util = require('util');
const Bot = require('slackbots');
const quotes = require('random-movie-quotes');
const params = {
    icon_emoji: ':rocket:'
};

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

        this.postMessageToChannel('general', 'Hello there !', params);
    };

    _isNotificationInGeneralChannel(message) {
        return CamJamBot.isMessage(message)
            && CamJamBot.isMessageToChannel(message)
            && !CamJamBot.isFromUser(message, this.user.id)
            && CamJamBot.isMentioningMe(message, this.settings.name, this.user.name, this.user.id);
    }

    _isNotificationInDirectMessage(){
        return CamJamBot.isMessage(message)
            && CamJamBot.isDirectMessage(message)
            && !CamJamBot.isFromUser(message, this.user.id)
    }
    _quotesMessage() {

        this.postMessageToChannel('general', quotes.getQuote() , params);
    };

    _onMessage(message) {
        console.log({
            isMessage: CamJamBot.isMessage(message),
            isMessageToChannel: CamJamBot.isMessageToChannel(message),
            isFromUser: CamJamBot.isFromUser(message, this.user.id),
            isMentioningMe: CamJamBot.isMentioningMe(message, this.settings.name, this.user.name, this.user.id)
        });
        if (_isNotificationInGeneralChannel(message) || _isNotificationInDirectMessage(message)) {
            console.log('new message : ', message);

            let text = message.text;
            let user = '<@' + this.user.id + '>';
            let char = text.substring(user.length + 1);
            switch(char) {
                case 'forward':
                case 'f' :
                    this.camJamPi.forward(this.camJamPi.thenStop);
                    break;
                case 'backward':
                case 'b' :
                    this.camJamPi.backward(this.camJamPi.thenStop);
                    break;
                case 'right':
                case 'r' :
                    this.camJamPi.right(this.camJamPi.thenStop);
                    break;
                case 'left':
                case 'l' :
                    this.camJamPi.left(this.camJamPi.thenStop);
                    break;
                case 'stop' :
                case 's' :
                    this.camJamPi.stop(this.camJamPi.thenStop);
                    break;
            }
            this._quotesMessage();
        }
    };

    static isMessage(message){
        return Boolean(message.type === 'message' && message.text);
    }

    static isMessageToChannel(message) {
        return typeof message.channel === 'string' && message.channel[0] === 'C';
    }

    static isDirectMessage(message) {
        return typeof message.channel === 'string' && message.channel[0] === 'D';
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
