

const {updateUserStatus, userUnLine} = require("./user");

function socketIo(io) {
    global.io = io;
    io.on('connection', (socket) => {
        console.log('a user connected');
        global.socket = socket;
        socket.on('login', (client)=>{
            updateUserStatus(client?.id, true, socket.id).then(r =>{

            })
        })

        socket.on('disconnect', ()=>{
            userUnLine(socket.id).then((res)=>{

            });
        })
    });
}

module.exports = socketIo;
