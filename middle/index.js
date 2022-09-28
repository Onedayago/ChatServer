
const {decrypt} = require("../util/token");

async function authToken(req, res, next) {

    if (req.url === "/api/user/login") {
        next();
        return;
    }
    if (await decrypt(req.headers.authorization)) {
        next();
    } else {
        res.json({
            code: 400,
            msg: 'token 过期了'
        })
    }
}

module.exports = {
    authToken
}
