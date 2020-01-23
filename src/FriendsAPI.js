const SteamUser = require('steam-user');
const SteamApi = require('web-api-steam')

class FriendsAPI {
    // 76561197964608834 - cardi
    // 76561198093113324 - imma
    auth = {
        accountName: null,
        password: null,
        apiKey: null,
        twoFactorCode: null,
    }
    client = null
    options = {
        targetSteamId: null,
        minLevel: null,
        maxLevel: null,
        timeInterval: null
    }

    constructor({accountName, password, apiKey, twoFactorCode},
                {targetSteamId, minLevel, maxLevel, timeInterval}) {
        this.auth = {accountName, password, apiKey, twoFactorCode}
        this.options = {targetSteamId, minLevel, maxLevel, timeInterval}

        this.client = new SteamUser();
        this.client.logOn({
            "accountName": this.auth.accountName,
            "password": this.auth.password,
            "twoFactorCode": this.auth.twoFactorCode
        });

        this.client.on('loggedOn', async (details) => {
            console.info('logged on')
        });
        this.client.on('error', function (e) {
            // Some error occurred during logon
            console.error(e);
            process.exit()
            return
        });
    }

    async addFriends(owner, apikey, timeReq) {
        const ids = await this.parseAction(owner, apikey)
        const filteredIdsBySteamLevel = await this.withFilterBySteamLevel(ids)
        const filteredIdsByDistants = this.withFilterByDistants(filteredIdsBySteamLevel)
        const filteredByPersonaStatus = await this.withFilterByPersonaStatus(filteredIdsByDistants, apikey)
        await this.addToFriendList(filteredByPersonaStatus, timeReq)
    }

    // parse for user ids
    async parseAction(owner, apikey) {
        const friendList = await new Promise((resolve) => {
            SteamApi.getFriendList(owner, apikey, (err, fList) => {
                if (err) {
                    console.error(`Ошибка получения списка друзей пользователя: ${owner}`)
                    process.exit()
                    return
                }
                resolve(fList)
            })
        })

        return friendList.map(profile => profile.steamid)
    }

    // filter by Steam Level
    async withFilterBySteamLevel(ids) {
        // parse for levels for each SID
        const {users: sidLevels} = await this.client.getSteamLevels(ids)

        return Object.keys(sidLevels).filter(sid => {
            return sidLevels[sid] >= this.options.minLevel && sidLevels[sid] <= this.options.maxLevel;
        });
    }

    // custom filter by friendship | gets only no friends
    withFilterByDistants(ids) {
        return ids.filter(sid => !this.client.myFriends.hasOwnProperty(sid))
    }

    // custom filter by persona status | (online, offline, snooze...)
    // 0 - Offline, 1 - Online, 2 - Busy, 3 - Away, 4 - Snooze, 5 - looking to trade, 6 - looking to play.
    // If the player's profile is private, this will always be "0"
    async withFilterByPersonaStatus(ids, apikey) {
        const actions = ids.map((sid) => new Promise(function (resolve) {
            SteamApi.getPlayerInfo(sid, apikey, (err, data) => {
                if (err) {
                    console.error(`Ошибка получения данных пользователя: ${sid}`)
                    process.exit()
                    return
                }
                resolve(data)
            })
        }))

        const profilesInfo = await Promise.all(actions);
        const filteredUsers = profilesInfo.filter((profile) => profile.personastate != 0 && profile.personastate != 3 && profile.personastate != 4)
        return filteredUsers.map(user => user.steamid) // steamids
    }

    // adding to friendlist
    async addToFriendList(sids, timeReq) {
        console.info(`Friend Requests has been started! Scan size for new requests: ${sids.length}`)

        let countOfRequests = 0
        const self = this

        const friendRequestPusher = setInterval(() => {
            if (sids.length === 0) {
                console.info(`All done! :)`)
                console.info(`Requested ${countOfRequests} of new people`)
                clearInterval(friendRequestPusher)
                process.exit(0)
                return
            }

            self.client.addFriend(sids[0], (err, personaName) => {
                if (err) {
                    clearInterval(friendRequestPusher)
                    console.error(`Ошибка добавления пользователя: ${err}`)
                    return
                } else {
                    console.log(`${countOfRequests + 1} / ${sids.length} | Request has been sent to => ${sids[0]} : with name => ${personaName};`)
                    countOfRequests++
                    sids.shift()
                    return
                }
            })
        }, timeReq)
    }
}

module.exports = FriendsAPI