const bcrypt = require('bcryptjs');

const password = 'password123';
const hashedPassword = '$2a$10$I7lBU7L1W5Aq7M4LcMFVt.iRIbtitjoWgXjAVl2vebNWkfmUupIpS';

bcrypt.compare(password, hashedPassword, (err, res) => {
    if (res) {
        console.log('Password is valid!');
    } else {
        console.log('Password is invalid!');
    }
});
