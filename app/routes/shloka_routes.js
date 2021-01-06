const { response } = require("express");

module.exports = function(app, db) {
    app.post('/shloka', (req, res) => {
        db.insert(req.body, (err, result) => {
                 if (err) {
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    res.send(result.ops[0]);
                }
        });
    });
    app.get('/ramayana', (req, res) => {
        var s = db.find({ "grantha": "ramayana"}).stream();
        data = []
        s.on('data', function(doc) {
            data.push(doc);
        });
        s.on('error', function(err) {
            console.log(err);
        });
        s.on('end', function() {
            res.send(data);
            console.log('All done!');
        });
    });
}
