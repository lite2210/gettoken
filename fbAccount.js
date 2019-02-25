const getToken = require('./token');

module.exports = function (app, db) {

    app.post('/simpleTask', async function (req, res) {
        switch (req.body.task) {
            case 'IMPORT':
                await db.collection('accs').insertMany(req.body.data, { ordered: false });
                break;
            default:
                console.log('not found task');
        };
        res.json({
            success: false
        })
    });

    app.post('/getToken', async function (req, res) {
        // console.log('request body', req.body);
        const resp = await getToken(req.body);
        // console.log('resp =', resp);
        res.json(resp);
    });
};