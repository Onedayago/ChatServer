

const {DataTypes} = require("sequelize");
const sequelize = require('../db/index');
const User = require("./user");

const Friend = sequelize.define('friend', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
    },
    refuse: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    accept: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    indexes: [
        {
            unique: true,
            fields: ['userId', 'friendId']
        }
    ]
})



User.hasMany(Friend, {
    foreignKey: 'userId',
    targetKey: 'id',
    constraints: true,
})

User.hasMany(Friend, {
    foreignKey: 'friendId',
    targetKey: 'id',
    constraints: true,
})



module.exports = Friend;

