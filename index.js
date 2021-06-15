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



function rentalTime(){
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();

  //date & time in YYYY.MM.DD format
  let RENTAL_DATE=year + "." + month + "." + date;

  return RENTAL_DATE;
}



app.get('/', function (req, res) {


  sql.connect(config, function (err) {

      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
      // query to the database and get the records
      request.query('use CHOLOFLIX ;select * from MOVIES order by RATING DESC', function (err, recordset) {

          if (err) console.log(err);

          // send records as a response
          res.render("home",{
            mainmovie: recordset.recordsets[0][0],
            movie: recordset.recordsets[0][1],
            movie3:recordset.recordsets[0][2]
          });

      });


  });


});





app.get("/:MOVIE_ID", function (req, res) {

  var request = new sql.Request();
  request.query('use CHOLOFLIX ;select * from MOVIES where MOVIE_ID='+req.params.MOVIE_ID+";", function (err, recordset) {


    if (err) console.log(err);

    res.render("rental",{
      movie: recordset.recordsets[0][0]
    });


  });


});




var server = app.listen(5000, function () {
    console.log('Server is running..');
});
