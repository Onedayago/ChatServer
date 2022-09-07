

const express = require("express");
const config = require("./config");
const bodyParser = require("body-parser");
const router = require("./route/index");
const app = express();
const sequelize = require("./db/index");
const http = require('http');
const server = http.createServer(app);
const { ExpressPeerServer } = require('peer');

const { Server } = require("socket.io");
const io = new Server(server);
const socketIo = require("./socket/index");


// 服务器提交的数据json化
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

router(app);

socketIo(io);

const peerServer = ExpressPeerServer(server, {
    path: '/myapp'
});

app.use('/peerjs', peerServer);

server.listen(config.port, async () => {
    console.log(`成功监听端口${config.port}`)
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})









