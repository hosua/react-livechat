/* Rename this file db-config.js and fill it with your proper database credentials */
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'db_user',
    password: 'db_pass',
    database: 'livechat_db',
});

module.exports = connection;
