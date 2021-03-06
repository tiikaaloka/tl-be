const { response } = require("express");
const fs = require('fs');
var eventHandler = require('events')
const emitter = new eventHandler();

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
    let data = undefined;
    app.get('/dhAtu', (req, res) => {
        let sql = `SELECT dhAtu, dhAtu_num, dhAtu_gaNa from tinkrit`;
        if(!! req.query.edit ) {
            sql = `SELECT * from tinkrit where dhAtu = '` + req.query.edit + ` '`;
        }
        console.log(sql);
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            data = rows;
            console.log('set the data');
            emitter.emit('done', res)
        });
        // close the database connection
        // db.close();
    });
    app.post('/dhAtu', (req, res) => {
        const path = 'test.txt';    
        let buffer = new Buffer(req.body);
        fs.open(path, 'w', function(err, fd) {
            if (err) {
                throw 'error opening file: ' + err;
            }
        
            fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                if (err) throw 'error writing file: ' + err;
                fs.close(fd, function() {
                    console.log('file written');
                })
            });
        });
    });
    emitter.on('done', (res) => {
        res.send(data);
    })
}
