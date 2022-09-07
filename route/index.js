

const user = require("./user");
const friend = require("./friend");
const msg = require("./msg");


function router (app){
    app.use('/api/user', user);
    app.use('/api/friend', friend);
    app.use('/api/msg', msg);
}

module.exports = router;
