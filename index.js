var express = require('express');
var app = express();

app.get('/', function (req, res) {

    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'test123',
        password: 'test123',
        server: 'localhost',
        database: 'HERTZ',
        options: {
    encrypt: false, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
    };

    // connect to your database
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query('use HERTZ ;select * from CARS', function (err, recordset) {

            if (err) console.log(err)

            // send records as a response
            console.log(recordset);

        });
    });
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});
