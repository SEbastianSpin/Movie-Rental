//jshint esversion:6
var express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const sql = require("mssql");
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));



// config for your database
var config = {
    user: 'test123',
    password: 'test123',
    server: 'localhost',

    options: {
encrypt: false, // for azure
trustServerCertificate: true // change to true for local dev / self-signed certs
}
};


// connect to your database
sql.connect(config, function (err) {

    if (err) console.log(err);




});

app.get('/', function (req, res) {

  // create Request object
  var request = new sql.Request();
  // query to the database and get the records
  request.query('use CHOLOFLIX ;select * from MOVIES', function (err, recordset) {

      if (err) console.log(err);
 
      // send records as a response
      res.render("home",{
        movie: recordset.recordsets[0][0]
      });

  });

});



var server = app.listen(5000, function () {
    console.log('Server is running..');
});
