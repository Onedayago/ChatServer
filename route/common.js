
const {Friend, User} = require("../model");

//判断两人是否是好友关系
async function isFriend(userId, friendId) {
    const res = await Friend.findOne({
        where: {
            userId,
            friendId,
            accept: true
        }
    })
    return !!res;
}

//判断用户是否存在
async function isExistUser(userId) {
    const res = await User.findOne({
        where: {
            id: userId
        }
    })
    return !!res;
}

//判断用户名是否存在
async function isExistUserName(username) {
    const res = await User.findOne({
        where: {
            username
        }
    })
    return !!res;
}

//判断用户是否在线
async function isUserOnline(userId) {
    const res = await User.findOne({
        attributes: ['isOnline', 'socketId'],
        where: {
            id: userId,
        }
    })
    return res.toJSON();
}

module.exports = {
    isFriend,
    isExistUser,
    isExistUserName,
    isUserOnline
}
