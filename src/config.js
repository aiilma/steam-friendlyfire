const SteamTotp = require('steam-totp')

/*
* You must specify this config with your own values
* */

const config = {
    guard: {
        "shared_secret": "",
        "serial_number": "",
        "revocation_code": "",
        "uri": "",
        "server_time": null,
        "account_name": "",
        "token_gid": "",
        "identity_secret": "",
        "secret_1": "",
        "status": null
    },
    auth: {
        "accountName": "",
        "password": "",
        "apiKey": "",
        "twoFactorCode": null,
    },
    options: {
        "targetSteamId": null,
        "minLevel": null,
        "maxLevel": null,
        "timeInterval": null
    }
}

config.auth.twoFactorCode = SteamTotp.generateAuthCode(config.guard.shared_secret)

module.exports = config