// const SteamCommunity = require('steamcommunity');
// const SteamID = require("steamid");
// const ReadLine = require('readline');
// const fs = require('fs');
//
// const DLNKA = '76561198201642689';
// const COMMENT = ':mceye::mceye:';
// const GROUP_LINK = ''
//
// const community = new SteamCommunity();
// const steamID = new SteamID(DLNKA);
//
// community.login(cfg.auth, (err, sessionID, cookies, steamguard) => {
//     if (err) {
//         console.error(err);
//         process.exit();
//         return;
//     }
//     console.log("Logged on!");
//
//     // GirlGamers - 103582791429533863
//     // less than ^ - 103582791462510450
//     getGroupMembers("103582791462510450")
//         .then(async members => await getFilteredMembers(members))
//         .then(filtered => console.log(filtered.length))
//         .catch(e => console.error(e))
//     // makeComment()
// });
//
//
// async function getGroupMembers(gid) {
//
//     return await new Promise((resolve, reject) => {
//         const promisedMembers = []
//         community.getGroupMembers(gid, (err, members) => {
//             if (err) reject(err);
//
//             members.forEach((sid, id) => {
//                 if (id < 500) {
//                     promisedMembers.push(new Promise((resolve, reject) => {
//                         community.getSteamUser(sid, (err, user) => {
//                             if (err) reject(err)
//                             else {
//                                 resolve(user)
//                             }
//                         })
//                     }))
//                 }
//             })
//
//             resolve(Promise.all(promisedMembers))
//         });
//     })
//
// }
//
// async function getFilteredMembers(members) {
//     // (public profile, is possible to comment) + online + steam level +10
//
//     // return members
//     return members.filter(member => {
//         return member.onlineState !== "offline"
//     })
// }


// --------------------------------------------------------------------------------------------------
// const rl = ReadLine.createInterface({
//     "input": process.stdin,
//     "output": process.stdout
// });
// rl.question("Username: ", function (accountName) {
//     rl.question("Password: ", function (password) {
//         console.log('welcome')
//         doLogin(accountName, password);
//     });
// });


// function getSteamUser(sid) {
//     community.getSteamUser(sid, (err, user) => {
//         if (err) console.error(err);
//         else {
//             comment(user, COMMENT)
//         }
//     });
// }
//
// function comment(user, comment) {
//     user.comment(comment, (err) => {
//         if (err) console.error(err);
//     });
//     console.log("Commented!");
//
//     setTimeout(() => {
//         process.exit();
//     }, 2000);
// }
// TODO:
//  1. указать ссылку на группу
//  2. отправить сообщение всем участникам группы раз в 5 секунд, если профиль не скрыт