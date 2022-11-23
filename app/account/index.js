const dbConfig = require("../config/db.config.js");
const enumerate = require("../utils/enum");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.account = require("./model.js").accountModelInit(mongoose);
db.rider = require("./model.js").accountTypeModelInit(mongoose,enumerate.RIDER);
db.company = require("./model.js").accountTypeModelInit(mongoose,enumerate.COMPANY);

module.exports = db;
