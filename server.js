const express = require('express');
const bodyParser     = require('body-parser');
const MongoClient    = require('mongodb').MongoClient;
const db             = require('./config/db');
const cors = require('cors');

const port = 8080;
const app            = express();
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoClient.connect(db.url, { useNewUrlParser: true,  useUnifiedTopology: true }, (err, database) => {  if (err) return console.log(err);     
    const dt = database.db("texts").collection('ramayana');
    require('./app/routes')(app, dt);app.listen(port, () => {  console.log('We are live on ' + port);});
});
