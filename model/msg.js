

const {DataTypes} = require("sequelize");
const sequelize = require('../db/index');
const User = require("./user");

const Msg = sequelize.define('msg', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    },
    msgContent: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    msgType: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'text'
    }
})

User.hasMany(Msg, {
    foreignKey: 'userId',
    targetKey: 'id',
    constraints: true,
})

User.hasMany(Msg, {
    foreignKey: 'friendId',
    targetKey: 'id',
    constraints: true,
})


module.exports = Msg;
