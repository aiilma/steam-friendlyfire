const cfg = require('./config');
const SteamCommunity = require('steamcommunity');
const SteamID = require("steamid");
const SteamUser = require('steam-user');

const ReadLine = require('readline');
const fs = require('fs');


const client = new SteamUser();
const DLNKA = '76561198201642689';
const community = new SteamCommunity();
const steamID = new SteamID(DLNKA);

client.logOn(cfg.auth);

client.on('loggedOn', () => {

    client.on('webSession', (sessionid, cookies) => {
        console.log('emmited')
        community.setCookies(cookies);
    })

    client.on("friendMessage", function (steamID, message) {
        if (!isNaN(message) && message.length <= 4) {
            client.chatMessage(steamID, `test calc num -> ${+message * 2}`);
        }
    })
})