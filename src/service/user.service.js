let mysql = require('../utils/mysql.async');

class UserService {
    constructor() {
        this.host = 'x';
    }

    async getUsers() {
        const connection = await mysql.connection();

        try {
            console.log("at Users query");
            let results = await connection.query('select * from oseitu.users');

            return results;
        } catch (err) {
            throw err;
        } finally {
            await connection.release();
        }
    }



    // getConnection() {
    //     let connection = mysql.createConnection({
    //         host: 'campaign-test-3.cjojv7gsvzpz.us-east-1.rds.amazonaws.com',
    //         user: 'oseitu',
    //         password: 'oseitu',
    //         database: 'oseitu'
    //     });

    //     connection.connect(function(err) {
    //         if (err) {
    //             return console.error('error: ' + err.message);
    //         }

    //         console.log('Connected to MySQL server.');
    //     });

    //     return connection;
    // }

    // closeConnection(conn) {
    //     conn.end();

    // }

    // async userQuery(conn, sql) {
    //     return conn.query(sql);
    // }
    
    // getAllUsers() {
    //     // Connect to mySQL
    //     let connection = mysql.createConnection({
    //         host: 'campaign-test-3.cjojv7gsvzpz.us-east-1.rds.amazonaws.com',
    //         user: 'oseitu',
    //         password: 'oseitu',
    //         database: 'oseitu'
    //     });

    //     connection.connect(function(err) {
    //         if (err) {
    //             return console.error('error: ' + err.message);
    //         }

    //         console.log('Connected to MySQL server.');
    //     });

    //     let sql = 'select email_address from oseitu.users';

    //     connection.query(sql, (err, results, fields) => {
    //         if (err) throw error;

    //         console.log(results);
    //     });

    //     connection.end();

    // }
}

module.exports = UserService;