

const express = require("express");
const router = express.Router();
const {Msg} = require("../model/index");
const {Op, QueryTypes} = require("sequelize");
const {Friend, User} = require("../model");
const {isFriend, isUserOnline} = require("./common");
const sequelize = require("../db");


//给好友发消息
router.post('/sendMsg', async (req, res, next) => {
    const {userId, friendId, msgContent, msgType} = req.body;
    try {
        //判断两人是否是好友
        if(await isFriend(userId, friendId)){
            const result = await Msg.create({
                userId,
                friendId,
                msgContent,
                msgType
            })
            if(result){
                const userInfo = await isUserOnline(friendId);
                const msgInfo = await sequelize.query(
                    "SELECT msgs.id, msgs.userId, msgs.friendId, users.username, toUsers.username as friendname, msgs.msgContent, msgs.createdAt from msgs LEFT JOIN users ON users.id = msgs.userId LEFT JOIN users as toUsers ON toUsers.id = msgs.friendId WHERE msgs.id = ?;",
                    {
                        replacements: [result.id],
                        type: QueryTypes.SELECT
                    }
                )
                //判断用户是否在线
                if(userInfo.isOnline){
                    global.io.to(userInfo.socketId).emit('msg', msgInfo[0]);
                }
                res.json({
                    code: 200,
                    msg: '发送成功',
                    data: msgInfo[0]
                })
            }else{
                res.json({
                    code: 400,
                    msg: '发送失败',
                })
            }
        }else{
            res.json({
                code: 400,
                msg: '不是好友'
            })
        }
    } catch (e) {
        res.json({
            code: 400,
            msg: '发送失败',
            err: e.toString()
        })
    }
})

//获取聊天记录列表
router.post('/getMsgList',async (req, res, next) => {
    const {userId, friendId} = req.body;
    try {
        const result = await sequelize.query(
            "SELECT msgs.id, msgs.userId, msgs.friendId, users.username, toUsers.username as friendname, msgs.msgContent, msgs.msgType,  msgs.createdAt from msgs LEFT JOIN users ON users.id = msgs.userId LEFT JOIN users as toUsers ON toUsers.id = msgs.friendId where (userId = ? AND friendId = ?) OR (userId = ? AND friendId = ?) order by msgs.createdAt asc",
            {
                replacements: [userId, friendId, friendId, userId],
                type: QueryTypes.SELECT
            })
        if(result){
            res.json({
                code: 200,
                msg: '获取成功',
                data: JSON.parse(JSON.stringify(result))
            })
        }else{
            res.json({
                code: 400,
                msg: '获取失败',
            })
        }
    } catch (e) {
        res.json({
            code: 400,
            msg: '获取失败',
            err: e.toString()
        })
    }
})

module.exports = router;
