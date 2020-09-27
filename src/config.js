const SteamTotp = require('steam-totp')

/*
* You must specify this config with your own values
* */

const config = {
    auth: {
        "accountName": "",
        "password": "",
        "apiKey":"",
        "twoFactorCode":""
    },
    options: {
        "targetSteamId": "",
        "minLevel": 5,
        "maxLevel": 100,
        "timeInterval": 6 * 1000
    }
}

config.auth.twoFactorCode = SteamTotp.generateAuthCode(config.guard.shared_secret)

module.exports = config