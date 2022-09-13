
const {User} = require("../model/index");

async function updateUserStatus(userId, isOnline, socketId, peerId) {
    const result = await User.update({
        isOnline,
        socketId,
        peerId,
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
