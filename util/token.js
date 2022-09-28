

const jwt = require('jsonwebtoken');

function encrypt(data){
    return new Promise((resolve => {
        jwt.sign({
            data: data
        }, 'secret', { expiresIn: '1 days' }, (err, token)=>{
            resolve(token);
        });
    }))

}

function decrypt(token){
    return new Promise((resolve => {
        jwt.verify(token, 'secret', {}, (err, data)=>{
            resolve(data);
        });
    }));

}

module.exports = {
    encrypt,
    decrypt
};
