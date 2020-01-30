const cfg = require('./config');
const SteamUser = require('steam-user')
const SteamCommunity = require('steamcommunity');
const SteamApi = require('web-api-steam')

const client = new SteamUser()
const community = new SteamCommunity();

// Communities
client.logOn({
    "accountName": cfg.auth.accountName,
    "password": cfg.auth.password,
    "apiKey": cfg.auth.apiKey,
    "twoFactorCode": cfg.auth.twoFactorCode
});

client.on('loggedOn', async (details) => {
    console.info('logged on')

    const inviteUsersToFriendList = await new Promise((resolve, reject) => {
        // parse for friendlist
        SteamApi.getFriendList(cfg.options.targetSteamId, cfg.auth.apiKey, (err, list) => {
            if (err) {
                reject(err)
            } else resolve(list)
        })
    }).then((friendList) => {
        // map to steamids
        return friendList.map(profile => profile.steamid)
    }).then(async (sidList) => {
        // sidList with filter by level
        const {users} = await client.getSteamLevels(sidList)
        return Object.keys(users).filter((sid) => (users[sid] >= cfg.options.minLevel && users[sid] <= cfg.options.maxLevel));
    }).then((sidList) => {
        // sidList with filter by unknown users only
        return sidList.filter(sid => !client.myFriends.hasOwnProperty(sid))
    }).then(async (sidList) => {
        // custom filter by persona status | (online, offline, snooze...)
        // 0 - Offline, 1 - Online, 2 - Busy, 3 - Away, 4 - Snooze, 5 - looking to trade, 6 - looking to play.
        // If the player's profile is private, this will always be "0"
        const actions = sidList.map((sid) => new Promise((resolve, reject) => {
            SteamApi.getPlayerInfo(sid, cfg.auth.apiKey, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        }))

        const profilesInfo = await Promise.all(actions)
        const filteredUsers = profilesInfo.filter((profile) => profile.personastate == 1)
        return filteredUsers.map(user => user.steamid) // steamids
    })
        .then(async (sidList) => {
            // filter users by having a background
            const stats = sidList.map((steamID) => new Promise((resolve, reject) => {
                community.userWithArtwork(steamID, (err, flag) => {
                    if (err) reject(err)
                    return resolve({bg: flag, sid: steamID})
                })
            }))

            sidList = await Promise.all(stats)
            const usersWithBg = sidList.filter(user => user.bg === true)
            return usersWithBg.map(user => user.sid)
        })
        .then(async (sidList) => {
            console.info(`Friend Requests has been started! Scan size for new requests: ${sidList.length}`)

            let countOfRequests = 0

            const friendRequestPusher = setInterval(() => {
                if (sidList.length === 0) {
                    console.info(`All done! :)`)
                    console.info(`Requested ${countOfRequests} of new people`)
                    clearInterval(friendRequestPusher)
                    process.exit(0)
                    return
                }

                client.addFriend(sidList[0], (err, personaName) => {
                    if (err) {
                        clearInterval(friendRequestPusher)
                        console.error(`Ошибка добавления пользователя: ${err}`)
                        return
                    } else {
                        console.log(`${countOfRequests + 1} / ${sidList.length} | Request has been sent to => ${sidList[0]} : with name => ${personaName};`)
                        countOfRequests++
                        sidList.shift()
                        return
                    }
                })
            }, cfg.options.timeInterval)

        })
        .catch((err) => {
            return err
        })

    console.log(inviteUsersToFriendList)
});

client.on('error', function (e) {
    // Some error occurred during logon
    console.error(e);
    process.exit()
    return
});

// var title = $('.profile_customization').parent().parent()
// var titles = $('.profile_customization').filter(function (i, el) {
//     // this === el
//     $child = $(this).children('.profile_customization_header')
//     return $child.text() === 'Витрина иллюстраций' || $child.text() === 'Artwork Showcase';
// })
// var flag = (titles.length > 0) ? true : false
// callback(null, flag);