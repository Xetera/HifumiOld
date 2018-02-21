"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require('../config0.json');
var Database = /** @class */ (function () {
    function Database(credentials) {
        this.defaultCredentials = {
            host: 'localhost',
            user: 'root',
            password: config.database.password,
            database: 'discord'
        };
    }
    Database.prototype.connect = function () {
    };
    Database.prototype.disconnect = function () {
    };
    return Database;
}());
exports.Database = Database;
