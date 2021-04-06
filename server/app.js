import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import {connect} from './helpers/dbHelper';
import authHelper from './helpers/authHelper';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/authorize', authRouter);

app.use(function (req, res, next) {
    if ( req.path.includes('/authorize'))
        return next();
    authHelper.verifyToken(req, req.header("authorization"), next, res);
});

app.use('/users', usersRouter);

connect();

export default app;
