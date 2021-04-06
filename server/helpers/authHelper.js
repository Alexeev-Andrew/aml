import jwt from "jsonwebtoken";
import config from "../config/config.json"
import dbHelper from "./dbHelper"

var decodeToken = async function(res, token) {
    return new Promise(function (resolve, rejected) {
        if (token) {
            jwt.verify(token, config.jwt_secret_key, (err, decoded) => {
                if (err) {
                    rejected(res.status(401).json("Incorrect token"));
                }
                resolve(decoded);
            });
        } else {
            rejected('');
        }
    })
}

var getTokenData = async function(tokenString, refreshToken) {
    return {
        access_token: tokenString,
        access_token_expire: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        refresh_token: refreshToken,
        refresh_token_expire: Math.floor(Date.now() / 1000) + (60 * 60 * 48),
    };
}

var createToken = async function(userId, userEmail) {
    const token = jwt.sign(
        {
            userId,
            userEmail
        },
        config.jwt_secret_key,
        {
            expiresIn: config.jwt_token_expire,
        },
    );
    return token;
}

var createRefreshToken = async function(userId, email) {
    const refreshToken = jwt.sign(
        {
            userId,
            token: 'refreshToken',
            email,
        },
        config.jwt_secret_key,
        {
            expiresIn: config.jwt_refresh_token_expire,
        },
    );
    return refreshToken;
}

var verifyToken = async function(req, token, next, res) {
    if (token && token.indexOf('Bearer ') == 0) {
        const tokenString = token.split(' ')[1];
        jwt.verify(tokenString, config.jwt_secret_key, async (err, decoded) => {
            if (err)
                return res.status(401).json("Invalid token");
            req.res.decoded = decoded;

            let user = await dbHelper.getUserByID(decoded.userId);

            if (new Date(user.access_token * 1000) < new Date()) {
                return res.status(401).json({ message: 'Error: Expired Token' });
            }

            next(null);
        });

    } else {
        return res.status(401).json({ message: 'No token provided.' });
    }
}


module.exports = {
    getTokenData: getTokenData,
    decodeToken: decodeToken,
    createToken: createToken,
    createRefreshToken: createRefreshToken,
    verifyToken: verifyToken
}