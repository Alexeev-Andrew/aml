import jwt from "jsonwebtoken";
import config from "../config/config.json"
import dbHelper from "./dbHelper"

var compareUsers = function(u1, u2){
    return !u1.first_name.localeCompare(u2.first_name) && !u1.last_name.localeCompare(u2.last_name)
        && !u1.birth.localeCompare(u2.birth) && !u1.passport_id.localeCompare(u2.passport_id)
}

module.exports = {
    compareUsers: compareUsers,

}