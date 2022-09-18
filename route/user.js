
const express = require("express");
const router = express.Router();
const {User} = require("../model/index");
const {isExistUser, isExistUserName} = require("./common");
const {Op, QueryTypes} = require("sequelize");
const {Friend} = require("../model");
const sequelize = require("../db");

//登录
router.post('/login', async (req, res, next) => {
    const {username, password} = req.body;
    try {
        const result = await User.findOne({
            where: {
                username,
                password
            }
        })
        if(result){
            res.json({
                code: 200,
                msg: '登录成功',
                data: result.toJSON()
            })
        }else{
            res.json({
                code: 400,
                msg: '登录失败'
            })
        }
    }catch (e){
        res.json({
            code: 400,
            msg: '登录失败',
            err: e.toString()
        })
    }

})

//注册
router.post('/register',async (req, res, next) => {
    const {username, password} = req.body;
    try {
        if(!await isExistUserName(username)){
            const result = await User.create({
                username,
                password,
            })
            if(result){
                res.json({
                    code: 200,
                    msg: '注册成功'
                })
            }else{
                res.json({
                    code: 400,
                    msg: '注册失败'
                })
            }
        }else{
            res.json({
                code: 400,
                msg: '用户名已存在'
            })
        }
    } catch (e) {
        res.json({
            code: 400,
            msg: '注册失败',
            err: e.toString(),
        })
    }
})

//更新 socketId
router.post('/updatesocketId', async (req, res, next) => {
    const {userId, socketId} = req.body;
    try {
        if(await isExistUser(userId)){
            const result = await User.update({
                socketId,
            }, {
                where: {
                    id: userId
                }
            })
            if(result[0]){
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
        }else{
            res.json({
                code: 400,
                msg: '用户不存在'
            })
        }
    } catch (e) {
        res.json({
            code: 400,
            msg: '更新失败',
            err: e.toString()
        })
    }
})

//更新用户在线状态
router.post('/updateUserStatus',async (req, res, next) => {
    const {userId, isOnline} = req.body;
    try {
        if (await isExistUser(userId)) {
           const result =  await User.update({
                isOnline
            },{
                where: {
                    id: userId
                }
            })
            if(result[0]){
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
        }else{
            res.json({
                code: 400,
                msg: '用户不存在'
            })
        }
    } catch (e) {
        res.json({
            code: 400,
            msg: '更新失败',
            err: e.toString()
        })
    }
})

//根据用户名获取用户列表
router.post('/getUsersByName',async (req, res, next) => {
    const {username, userId, page, pageSize} = req.body;
    const searchName = "%"+username+"%";
    try {
        const results = await sequelize.query(
            "SELECT users.id, users.username from users WHERE id not in (SELECT friends.userId from friends WHERE  friends.userId != ?) AND id != ? AND users.username LIKE ? LIMIT ?, ?; ",
            {
                replacements: [userId, userId, searchName, parseInt(page), parseInt(pageSize)],
                type: QueryTypes.SELECT
            }
        );

        if(results){
            let data = JSON.parse(JSON.stringify(results));
            // data['count'] = metadata;
            res.json({
                code: 200,
                msg: "获取成功",
                data
            })
        }else{
            res.json({
                code: 400,
                msg: "获取失败",
            })
        }
    } catch (e) {
        res.json({
            code: 400,
            msg: "获取失败",
            err: e.toString()
        })
    }
})


//获取用户在线状态
router.post('/getUserStatus', async (req, res, next) => {
    const {userId} = req.body;
    try {
        const result = await User.findOne({
            attributes: ['isOnline', 'socketId', 'peerId'],
            where: {
                id: userId
            }
        })

        if(result){
            res.json({
                code: 200,
                msg: '获取成功',
                data: result.toJSON()
            })
        }else {
            res.json({
                code: 400,
                msg: '获取失败',
            })
        }
    } catch (e) {
        res.json({
            code: 400,
            msg: '获取失败',
        })
    }
})

module.exports = router;
