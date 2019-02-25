const MongoClient = require('mongodb').MongoClient,
    cf = require('./cf');
let db;

module.exports = function () {
    let module = {};
    module.init = function () {
        console.log('Init db');
        return MongoClient.connect(cf.url, {
            loggerLevel: 'error'
        }).then((database) => {
            db = database;

            console.log('MongoDB Connected');
            database.on('authenticated', () => console.log('Db authenticated'));
            database.on('close', () => console.log('Connection closed'));
            database.on('reconnect', () => console.log('Reconnected'));
            return db;
        }).catch(function (err) {
            console.log('Init MongoDB Error', err);
            process.exit(10);
        })
    };

    module.collection = function (name) {
        if(db){
            return db.collection(name);
        } else {
            console.log('Re-init db');
            return module.init().then(function (db) {
                return db.collection(name)
            })
        }
    };

    return module;
};