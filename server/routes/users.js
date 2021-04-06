var express = require('express');
var router = express.Router();

import db from '../helpers/dbHelper';
import auth from '../helpers/authHelper';
import userHelper from '../helpers/userHelper';

/* GET users listing. */
router.get('/list', async function(req, res, next) {
  let user_list = await db.getAllUsers();
  res.send(user_list[0]);
});

router.get('/user_info', async function(req, res, next) {
  console.log(req.res.decoded.userId);
  let user_list = await db.getUserByID(req.res.decoded.userId);
  res.send(user_list[0]);
});
router.get('/getTransactions', async function(req, res, next) {
  let user_list = await db.getTransactions(req.res.decoded.userId);
  res.send(user_list[0]);
});

router.post('/add-transaction', async function(req, res, next) {
  let ukr_sanctions = (await db.get_ukrainian_sanctions())[0];
  let world_sanctions = (await db.get_world_sanctions())[0];

  let user_from = (await db.getUserByID(req.res.decoded.userId))[0];
  if(user_from.length == 0)
    res.status(500).json({error :'User not found'});

  user_from = user_from[0];

  for(let s of ukr_sanctions){
    if(userHelper.compareUsers(s,user_from)){
      return res.status(500).json({error : 'You are in ukrainian sanctions list'});
    }
  }
  for(let s of world_sanctions){
    if(userHelper.compareUsers(s,user_from)){
      return res.status(500).json({error :'You are in world sanctions list'});
    }
  }
  console.log(req.res.decoded.userId+' '+ req.body.id + ' ' + req.body.amount)
  let transaction = await db.addTransaction(req.res.decoded.userId, req.body.amount);
  let user_updated = await db.updateUser(req.res.decoded.userId, req.body.amount);
  return res.json({
    transaction: {
      amount: req.body.amount,
      date: new Date()
    },
    user: (await db.getUserByID(req.res.decoded.userId))[0][0],
  });
});



module.exports = router;
