const express = require('express');
const app = express();

// const fs = require('fs');
// const path = require('path');
const util = require('util');
const cf = require('./cf');
const cn = require('./cn')();
const port = cf.port;

const router = express.Router();

const morgan = require('morgan'); // logger
const bodyParser = require('body-parser'); // parse posts

// create a write stream (in append mode)
// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'debug.log'), {flags: 'a'});

// set up our express application
// app.use(morgan('dev', {stream: accessLogStream})); // log every request to the console
// app.use(morgan('dev'));

// Or 'w' to truncate the file every time the process starts.
// const logStdout = process.stdout;

// console.log = function () {
//     accessLogStream.write(util.format.apply(null, arguments) + '\n');
//     logStdout.write(util.format.apply(null, arguments) + '\n');
// };
// console.error = console.log;

// app.use(bodyParser()); // get information from html forms
app.use(bodyParser.json({limit: '50mb'}));       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    limit: '50mb',
    extended: true
}));

app.use('/api', router);

// serve template
app.use(express.static('templates'));

// launch ======================================================================
cn.init().then(async function (db) {
    db.collection('log').insertOne({ task: 'Mongodb Init', at: new Date() });
    app.listen(port);
    require('./fbAccount')(router, db);
    console.log(`The magic happens on port ${port}`);
});