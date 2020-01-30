var SteamUser = require('steam-user');
var SteamCommunity = require('steamcommunity');
const SteamID = require("steamid");
var SteamTotp = require('steam-totp');
var TradeOfferManager = require('steam-tradeoffer-manager');
var fs = require('fs');
const request = require('request');

var firstClient = new SteamUser();

// Managers
var firstManager = new TradeOfferManager({
    "steam": firstClient,
    "domain": "localhost",
    "language": "en"
});


// Communities
var firstCommunity = new SteamCommunity();

// Config
var config = JSON.parse(fs.readFileSync('./config.json'));

var firstLogonOptions = {
    "accountName": config.bots.firstaccount.username,
    "password": config.bots.firstaccount.password,
    "twoFactorCode": SteamTotp.getAuthCode(config.bots.firstaccount.shared_secret)
};

// Logging in...
firstClient.logOn(firstLogonOptions);

firstClient.on('loggedOn', () => {
    console.log('Logged In!');
    firstClient.setPersona(SteamUser.EPersonaState.Online);

    // firstClient.gamesPlayed(["Testing +REP BOT", 440, 570]);
    // const emojis = [':mceye::mceye:', ':marbleball:', ':A::Y:', ':roskomnadzor:']
    // let emoji
    //
    // let count = 0
    // const interval = setInterval(() => {
    //     if (count > 50) clearInterval(interval)
    //     emoji = emojis[Math.floor(emojis.length * Math.random())];
    //     firstCommunity.postUserComment('76561198051995114', emoji)
    //     count++
    // }, 5000)
});

firstClient.on('webSession', (sessionid, cookies) => {
    firstManager.setCookies(cookies);
    firstCommunity.setCookies(cookies);
});


// firstClient.on('friendRelationship', function (steamID, relationship) {
//
//     if (relationship == SteamUser.Steam.EFriendRelationship.RequestRecipient) {
//         firstClient.addFriend(steamID);
//         console.log(" ");
//         console.log("Accepted friend request from: " + steamID);
//         // firstClient.chatMessage(steamID, "Welcome To My +REP Bot, type !help to get started!");
//     }
// });


firstClient.on("friendMessage", function(steamID, message) {
    if (message === '!bg') {
        firstCommunity.getUserProfileBackground(steamID, (err, bg) => {
            if (err) console.log(err)

            bg = bg.replace(/\'/g, "")

            const options = {
                url: bg,
                method: "get",
                encoding: null
            };

            console.log('Requesting image..');
            request(options, function (error, response, body) {
                if (error) {
                    console.error('error:', error);
                } else {
                    firstCommunity.sendImageToUser(steamID, body, (err, imgUrl) => {
                        console.log(`sent bg image to ${steamID}`)
                    })
                }
            });
        })
    }
})