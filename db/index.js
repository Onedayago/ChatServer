const {Sequelize} = require("sequelize");


const sequelize = new Sequelize('mychat', 'root', '137212liushun', {
    host: 'localhost',
    dialect: 'mysql',/* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */
    logging: console.log
});


module.exports = sequelize;
