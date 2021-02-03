const UserService = require('./user.service');

console.log('TEST');

let userService = new UserService();



async function doTheThing() {
    let users = await userService.getUsers();

    console.log(users);
}

doTheThing();


// let myConnection = userService.getConnection();

// myConnection.query('select * from oseitu.users', (error, results, fields) => {
//     if (error) throw error;

//     console.log(results);
// })

// myConnection.end();

