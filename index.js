const OfflineDatabase = require('./OfflineDatabase');

const db = new OfflineDatabase('test1');

async function main() {
    let testUser = {
        name: 'Alice',
        email: 'alice@email.com',
    };

    //   
    const users = await db.ref('users');
    const newUUID = await users.push(testUser);
    console.log(testUser.name, 'is a new user with UUID:',newUUID);
}

main();
