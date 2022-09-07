

const {DataTypes} = require("sequelize");
const sequelize = require('../db/index');

//定义用户表
const User = sequelize.define('user', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    socketId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isOnline: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

User.sync({force: false});

module.exports = User;
