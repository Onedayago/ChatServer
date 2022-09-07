
const {User} = require("../model/index");

async function updateUserStatus(userId, isOnline, socketId) {
    const result = await User.update({
        isOnline,
        socketId
    }, {
        where: {
            id: userId
        }
    })
}

async function userUnLine(socketId) {
    const result = await User.update({
        isOnline: false,
    }, {
        where: {
            socketId: socketId
        }
    })
}


module.exports = {
    updateUserStatus,
    userUnLine
}
