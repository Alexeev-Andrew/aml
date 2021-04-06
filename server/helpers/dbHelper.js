"use strict";
import mysql from "mysql2"
import config from "../config/config.json"
var connection;

var connect = async function(){
    if(connection!=null)
        return;
    connection = mysql.createConnection({
        host: config.db.base_url,
        user: config.db.username,
        password: config.db.password
    }).promise();
    connection.connect(function(err) {
        if (err)
            throw err;
        console.log("Connected!");
    });
}

var getConnection = async function(){
    if(connection)
        return connection;
    else {
        let promise = await connect();
        return connection;
    }
}

var getUser = async function(email, password){
    return connection.query(`SELECT * FROM aml.users where email='${email}' AND password = '${password}'`);
}

var getAllUsers = async function(id){
    return connection.query(`SELECT * FROM aml.users`);
}

var getUserByID = async function(id){
    return connection.query(`SELECT * FROM aml.users where id = ${id}`);
}

var get_ukrainian_sanctions = async function(){
    return connection.query(`SELECT first_name, last_name, birth, passport_id FROM aml.ukraine_sanctions`);
}

var get_world_sanctions = async function(){
    return connection.query(`SELECT first_name, last_name, birth, passport_id FROM aml.world_sanctions`);
}

var addTransaction = async function(user_id, amount){
    return connection.query(`Insert into aml.transactions (user_from, user_to, amount) values(null, ${user_id}, ${amount})`);
}

var addUser = async function(first_name, last_name, middle_name, birth, passport_id, email, password){
    return connection.query(`Insert into aml.users (first_name, last_name, middle_name, birth, passport_id, email, password ) values('${first_name}', '${last_name}', '${middle_name}', '${birth}', '${passport_id}', '${email}', '${password}' )`);
}

var updateUser = async function(user_id, amount){
    return connection.query(`Update aml.users set balance = balance + ${amount} where id = ${user_id}`);
}

var getTransactions = async function(id){
    return connection.query(`SELECT * FROM aml.transactions where user_to = ${id}`);
}

module.exports = {
    connect: connect,
    getUser: getUser,
    getUserByID: getUserByID,
    getAllUsers: getAllUsers,
    get_ukrainian_sanctions: get_ukrainian_sanctions,
    get_world_sanctions: get_world_sanctions,
    addTransaction: addTransaction,
    updateUser: updateUser,
    getTransactions: getTransactions,
    addUser: addUser,
}