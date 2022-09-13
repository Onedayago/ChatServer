
const express = require("express");
const router = express.Router();

const {Friend} = require("../model/index");
const {Op, QueryTypes} = require("sequelize");
const sequelize = require("../db");
const User = require("../model/user");

//发起添加好友
router.post('/addFriend', async (req, res, next) => {
    const {userId, friendId} = req.body;
    try {
        const result = await Friend.create({
            userId,
            friendId,
        })
        if(result){
            res.json({
                code: 200,
                msg: '发送成功'
            })
        }else{
            res.json({
                code: 400,
                msg: '发送失败'
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

//获取添加好友请求
router.post('/getAddFriendMsg',async (req, res, next) => {
    const {userId} = req.body;
    try {
        const result = await sequelize.query(
            "select friends.id, users.id as userId, users.username from friends INNER JOIN users on friends.userId = users.id WHERE friends.friendId = ? AND friends.accept = FALSE",
            {
                replacements: [userId],
                type: QueryTypes.SELECT
            }
        )
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

//获取好友列表
router.post('/getFriendList',async (req, res, next) => {
    const {userId} = req.body;
    try {
        const result = await sequelize.query(
            "SELECT friends.id, users.id as userId, users.peerId, users.username from friends INNER JOIN users on users.id = friends.userId WHERE users.id != ? AND friends.friendId = ? AND friends.accept = TRUE;",
            {
                replacements: [userId, userId],
                type: QueryTypes.SELECT
            }
        )
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

//接受好友添加
router.post('/acceptAddFriend',async (req, res, next) => {
    const {id, userId} = req.body;
    const t = await sequelize.transaction();
    try {
        //先查询这条好友请求的信息
        const msgInfo = await Friend.findOne({
            where: {
                id,
                friendId: userId
            }
        })
        let addMsg = true;
        //判断被加好友的人是否也发送了添加好友请求
        const hasAdd = await Friend.findOne({
            where: {
                userId,
                friendId: msgInfo.userId
            }
        })
        //如果被加好友的人没有发送请求，则新增加一条数据
        if(!hasAdd){
            addMsg = await Friend.create({
                userId,
                friendId: msgInfo.userId,
                accept: true
            },{ transaction: t })
        }

        const result = await Friend.update({
            accept: true,
        },{
            where: {
                [Op.or]: [
                    {id}
                ]
            }
        },{ transaction: t })

        if (result[0] && addMsg){
            await t.commit();
            res.json({
                code: 200,
                msg: '更新成功',
            })
        }else{
            await t.rollback();
            res.json({
                code: 400,
                msg: '更新失败'
            })
        }
    } catch (e) {
        await t.rollback();
        res.json({
            code: 400,
            msg: '更新失败',
            err: e.toString()
        })
    }
})

//拒绝好友添加
router.post('/refuseAddFriend',async (req, res, next) => {
    const {id, userId, friendId} = req.body;
    try {
        const result = await Friend.destroy({
            where: {
                [Op.or]: [
                    {id},
                    {userId, friendId}
                ]
            }
        })
        if(result){
            res.json({
                code: 200,
                msg: '更新成功'
            })
        }else{
            res.json({
                code: 400,
                msg: '更新失败'
            })
        }
    }catch (e){
        res.json({
            code: 400,
            msg: '更新失败',
            err: e.toString()
        })
    }

})

//删除好友
router.post('/deleteFriend', async (req, res, next) => {
    const {userId, friendId} = req.body;
    try {
        const result = await Friend.destroy({
            where: {
                [Op.or]: [
                    {userId, friendId},
                    {userId: friendId, friendId: userId}
                ]
            }
        })
        if(result){
            res.json({
                code: 200,
                msg: "删除成功"
            })
        }else{
            res.json({
                code: 400,
                msg: "删除失败"
            })
        }
    } catch (e) {
        res.json({
            code: 400,
            msg: "删除失败"
        })
    }
})

module.exports = router;
