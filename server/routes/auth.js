import express from 'express';
var router = express.Router();

import db from '../helpers/dbHelper';
import authHelper from '../helpers/authHelper';
import config from '../config/config.json';

/* GET home page. */
router.post('/sign_in', async function(req, res, next) {
    let response = await db.getUser(req.body.email, req.body.password);
    let user_info = response[0];
    if(user_info[0] && user_info[0].id){
        let token = await authHelper.createToken(user_info[0].id, user_info[0].email);
        console.log(token);
        let refresh = await authHelper.createRefreshToken(user_info[0].id, user_info[0].email);
        const response = {
            user_id: user_info.id,
            token_data: {
                access_token: token,
                refresh_token: refresh,
                expires_in: (new Date()).setSeconds(60*60*24),
                token_type: 'bearer'
            }
        };
        res.send(response);
    }
    else
        res.status(500).json({
            err: "Incorrect email or password"
        })

});

router.post('/sign_up', async function(req, res, next) {
    await db.addUser(req.body.first_name, req.body.last_name, req.body.middle_name, req.body.birth, req.body.passport_id, req.body.email, req.body.password);
    let response = await db.getUser(req.body.email, req.body.password);
    let user_info = response[0];

    let token = await authHelper.createToken(user_info[0].id, user_info[0].email);
    let refresh = await authHelper.createRefreshToken(user_info[0].id, user_info[0].email);

    const response2 = {
        user_id: user_info.id,
        token_data: {
            access_token: token,
            refresh_token: refresh,
            expires_in: (new Date()).setSeconds(60*60*24),
            token_type: 'bearer'
        }
    };
    res.send(response2);
});

export default router;
