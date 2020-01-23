const Cfg = require('./config');
const SteamCommunity = require('steamcommunity');
const ReadLine = require('readline');
const SteamID = require("steamid");

const dlnka = '';


const comments = ['a', 'b', 'c', 'd', 'e'];
const rand = Math.floor(Math.random() * comments.length);
const concat = comments[rand];

const community = new SteamCommunity();
const steamID = new SteamID(dlnka);
const rl = ReadLine.createInterface({
    "input": process.stdin,
    "output": process.stdout
});

// rl.question("Username: ", function (accountName) {
//     rl.question("Password: ", function (password) {
//         console.log('welcome')
//         doLogin(accountName, password);
//     });
// });

community.login({
    "accountName": Cfg.auth.accountName,
    "password": Cfg.auth.password,
    "twoFactorCode": Cfg.auth.twoFactorCode
}, (err, sessionID, cookies, steamguard) => {
    if (err) {
        console.error(err);
        process.exit();
        return;
    }

    console.log("Logged on!");

    community.getSteamUser(steamID, (err, user) => {
        if (err) console.error(err);
        else {
            user.comment(concat, (err) => {
                if (err) console.error(err);
            });
            console.log("The comment has been posted");

            setTimeout(function () {
                process.exit();
            }, 2000);
        }
    });
});