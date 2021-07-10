const Router = require("express");
const session = require("express-session");
const sessionStore = require("connect-pg-simple")(session);
const db = require("./db");

const router = new Router();

const authController = require('./auth.controller');

/*router.use(session({
    store : new sessionStore({
        pool : db,
        tableName : "session"
    }),
    secret : "superSecretKey",
    resave : false,
    saveUninitialized : false,
    cookie: { maxAge: 60 * 60 * 1000 } // 10 min
}));*/

router.post("/login", authController.loginUser);

router.post("/access", authController.accessUser);

module.exports = router;