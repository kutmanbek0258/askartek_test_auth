const db = require("./db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');
const uid = require('uid-safe').sync;

class AuthController {

    async loginUser(req, res){
        const { email, password } = req.body;

        console.log(req.body);

        let user = await db.query("SELECT * from users WHERE email = $1", [email]);

        if(!user.rows[0]){
            console.log("User not exist");
            await res.json("User not exist");
        }else {
            let User = user.rows[0];
            const isMatch = await bcrypt.compare(password, User.hash_password);
            if(!isMatch){
                console.log("Incorrect password");
                await res.json("Incorrect password")
            }else {
                const uuid = uid(24);
                const expire = Date.now() + (10 * 60 * 1000);
                const expireISO = new Date(expire).toLocaleString();

                console.log(expireISO);
                console.log(new Date(Date.now()));

                let session = await db.query("INSERT INTO sessions(sid, sess, expire) values ($1, $2, $3) RETURNING *", [uuid, User, expireISO]);

                User.session = session.rows[0].sid;
                await res.json(User);
            }
        }
    }

    async accessUser(req, res){
        const {sid} = req.body;

        const now = new Date(Date.now());

        let session = await db.query("SELECT * FROM sessions WHERE sid = $1 AND expire > $2", [sid, now]);

        console.log(now);
        console.log(session.rows[0]);

        if(session.rows[0]){
            await res.json({
                authorized: true,
                user_id: session.rows[0].sess.id
            })
        }else {
            await res.json({
                authorized: false
            })
        }

        /*if(req.session){
            await res.json({
                authorized: true
            })
        }else {
            await res.json({
                authorized: false
            })
        }*/
    }

}

module.exports = new AuthController();