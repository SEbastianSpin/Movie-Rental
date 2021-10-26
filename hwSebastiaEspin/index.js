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

const pool1 = new sql.ConnectionPool(config);

const pool1Connect = pool1.connect();

pool1.on('error', err => {
    console.log(err);
});


async function messageHandler(q) {
    await pool1Connect; // ensures that the pool has been created
    try {
        const request = pool1.request(); // or: new sql.Request(pool1)
        const result = await request.query(q)
        //console.log(result);
        return result;
    } catch (err) {
        console.error('SQL error', err);
    }
}



function rentalTime(p=0){
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear()+p;

  //date & time in YYYY.MM.DD format
  let RENTAL_DATE=year + "." + month + "." + date;

  return RENTAL_DATE;
}




app.get('/', function (req, res) {


  (async () => {
    let movies=await messageHandler('use CHOLOFLIX ;select * from MOVIES');

    res.render("home",{
        mainmovie: movies.recordsets[0][0],
        movie:movies.recordsets[0][1],
        movie3:movies.recordsets[0][2]
    });
  })()


});


app.get('/orders', function (req, res) {

  (async () => {
    let orders=await messageHandler('use CHOLOFLIX ;select  ORDERS.ORDERS_ID, MOVIES.MOVIE_TITLE, ORDERS.RENTAL_DATE, ORDERS.RETURN_DATE,ORDERS.NET_AMOUNT ,ORDERS.DISCOUNT, ORDERS.GROSS_AMOUNT from ORDERS INNER JOIN MOVIES ON ORDERS.MOVIE_ID =MOVIES.MOVIE_ID;');

    res.render("orders",{

     orders:orders.recordsets[0]
    });
  })()


});

app.get('/movies', function (req, res) {



    (async () => {
      let movies=await messageHandler('use CHOLOFLIX; select * from MOVIES');

      res.render("movies",{

       orders:movies.recordsets[0]
      });
    })()
});



app.get('/movies/:init/:end/:name/:genra/:rat', function (req, res) {

  console.log('params / use CHOLOFLIX; Select * from MOVIES m where YEAR ( m.RELEASE_DATE) >= '+ req.params.init + 'and YEAR( m.RELEASE_DATE) <='+ req.params.end + "and m.MOVIE_TITLE like \'\%"+req.params.name +"\%\'"+ "and m.GENRE =" + "\'" +req.params.genra + "\'"  +"order by RATING DESC");
  (async () => {
  //  const movies=await messageHandler('use CHOLOFLIX; Select * from MOVIES m where YEAR ( m.RELEASE_DATE) >= '+ req.params.init + 'and YEAR( m.RELEASE_DATE) <= '+ req.params.end + "and m.MOVIE_TITLE like \'\%"+req.params.name +"\%\'"+ "and m.GENRE =" + "\'" +req.params.genra + "\'"  +" and m.RATING >="+req.params.rat+";");
   const movies=await messageHandler('use CHOLOFLIX; Select * from MOVIES m where YEAR ( m.RELEASE_DATE) >= '+ req.params.init + 'and YEAR( m.RELEASE_DATE) <= '+ req.params.end + "and m.MOVIE_TITLE like \'\%"+req.params.name +"\%\'"+ "and m.GENRE =" + "\'" +req.params.genra + "\'"  +"order by RATING DESC");
    res.render("movies",{
     orders:movies.recordsets[0]
    });
  })()

});


app.get('/movies/sort', function (req, res){
let iyear=req.query.iyear;
let eyear=req.query.eyear;
let genra=req.query.genra;
let title=req.query.name;
let rat=req.query.rat;
console.log("tat: "+req.query.rat)

if(title===""){
  title=" ";
}
if(iyear===""){
  iyear=1900;
}
if(eyear===""){

  eyear=2200;
}

if(rat===""){
  rat=1;
}
if(genra===""){
  console.log('?? use CHOLOFLIX; Select * from MOVIES m where YEAR ( m.RELEASE_DATE) >= '+ iyear+ 'and YEAR( m.RELEASE_DATE) <= '+ eyear+ "and m.MOVIE_TITLE like \'\%"+title+"\%\'"+ "and m.GENRE =" + "\'" +genra + "\'"  +" and m.RATING >="+ rat +";");

  (async () => {
   const movies=await messageHandler('use CHOLOFLIX; Select * from MOVIES m where YEAR ( m.RELEASE_DATE) >= '+ iyear+ 'and YEAR( m.RELEASE_DATE) <= '+ eyear+ "and m.MOVIE_TITLE like \'\%"+title+"\%\'"  +" and m.RATING >="+ rat +";");
  // ('use CHOLOFLIX; Select * from MOVIES m where YEAR ( m.RELEASE_DATE) >= '+iyear + ' and YEAR( m.RELEASE_DATE) <= '+eyear + "and m.MOVIE_TITLE like \'\%"+  req.query.name+"\%\'"+ "and m.GENRE =" + "\'" +req.query.genra + "\'"  +"order by RATING DESC");

    res.render("movies",{
     orders:movies.recordsets[0]
    });
  })()
}
if(genra!=""){
  console.log('use CHOLOFLIX; Select * from MOVIES m where YEAR ( m.RELEASE_DATE) >= '+ iyear+ 'and YEAR( m.RELEASE_DATE) <= '+ eyear+ "and m.MOVIE_TITLE like \'\%"+title+"\%\'"+ "and m.GENRE =" + "\'" +genra + "\'"  +" and m.RATING >="+ rat +";");

  (async () => {
   const movies=await messageHandler('use CHOLOFLIX; Select * from MOVIES m where YEAR ( m.RELEASE_DATE) >= '+ iyear+ 'and YEAR( m.RELEASE_DATE) <= '+ eyear+ "and m.MOVIE_TITLE like \'\%"+title+"\%\'" + "and m.GENRE =" + "\'" +genra + "\'"  +" and m.RATING >="+ rat +";");
  // ('use CHOLOFLIX; Select * from MOVIES m where YEAR ( m.RELEASE_DATE) >= '+iyear + ' and YEAR( m.RELEASE_DATE) <= '+eyear + "and m.MOVIE_TITLE like \'\%"+  req.query.name+"\%\'"+ "and m.GENRE =" + "\'" +req.query.genra + "\'"  +"order by RATING DESC");

    res.render("movies",{
     orders:movies.recordsets[0]
    });
  })()
}




});


app.get("/rental/:MOVIE_ID/:PRICE", function (req, res) {

  (async () => {
    let movies=await messageHandler('use CHOLOFLIX ;select * from MOVIES where MOVIE_ID='+req.params.MOVIE_ID+";");

    res.render("rental",{
        movie: movies.recordsets[0][0]
    });
  })()



});

app.post("/rental/:MOVIE_ID/:PRICE",function(req, res){

//let value= req.body.cost;
//console.log(value);
//let val=(value*100)/123
  let q="use CHOLOFLIX ; INSERT INTO ORDERS (RENTAL_DATE , RETURN_DATE, MOVIE_ID, NET_AMOUNT,DISCOUNT,GROSS_AMOUNT)"+"VALUES(\'"+rentalTime()+"\',\'"+rentalTime(1)+"\',"+req.params.MOVIE_ID+","+req.params.PRICE+","+0+","+req.params.PRICE+ ");";
 messageHandler(q);

});

app.get('/ddd/:ORDER_ID', (req, res) => {

 console.log('Delete use CHOLOFLIX ; delete from ORDERS where ORDERS_ID='+req.params.ORDER_ID+";");


     messageHandler('use CHOLOFLIX ; delete from ORDERS where ORDERS_ID='+req.params.ORDER_ID+";");


});


app.get('/update/order/admin/loc/orders/admin/thiss/:ORDER_ID', (req, res) => {

  (async () => {
    let orders=await messageHandler('use CHOLOFLIX ;select  ORDERS.ORDERS_ID, MOVIES.MOVIE_TITLE, ORDERS.RENTAL_DATE, ORDERS.RETURN_DATE,ORDERS.NET_AMOUNT ,ORDERS.DISCOUNT, ORDERS.GROSS_AMOUNT from ORDERS INNER JOIN MOVIES ON ORDERS.MOVIE_ID =MOVIES.MOVIE_ID where ORDERS_ID='+req.params.ORDER_ID+";");

    res.render("update",{

     order:orders.recordsets[0][0]
    });
  })()

});

app.post('/update/:ORDER_ID', (req, res) => {
  console.log('hi');



  (async () => {
    await deleter('use CHOLOFLIX ; UPDATE  ORDERS set RENTAL_DATE RETURN_DATE MOVIE_ID NET_AMOUNT DISCOUNT  GROSS_AMOUNT where ORDERS_ID='+req.params.MOVIE_ID+";");
  })()

});




var server = app.listen(5000, function () {
    console.log('Server is running..');
});


//http://localhost:5000/movies/2000/2099/%20/action/%20/
//http://localhost:5000/movies/2000/2099/Batman/action/%20/
