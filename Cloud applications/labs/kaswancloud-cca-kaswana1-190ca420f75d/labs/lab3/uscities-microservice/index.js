const express = require('express')
const app = express()
var port = process.env.PORT || 8080;
//app.use(express.static('static'))
app.use (express.urlencoded({extended: false}))
const cors = require('cors');
app.use(cors());
app.listen(port)
console.log(" US City Search Microservice is running on port " + port)
app.get('/', (req, res) => {
    res.send("US City Search Micorsercvice by Kaswan");
})
const MongoClient = require('mongodb').MongoClient;
const mongourl = "mongodb+srv://cca-kaswna1:AZg3zvPKXJFjmJW@cca-kaswana1-hdlxr.mongodb.net/cca-labs?retryWrites=true&w=majority"; //mongodb URL
const dbClient = new MongoClient(mongourl,
                {useNewUrlParser: true, useUnifiedTopology: true });
dbClient.connect(err => {
    if (err) throw err;
    console.log("conneted to MongoDB Cluster")
});  

app.get('/uscities-search/:zips(\\d{1,5})', function (req, res) {
    const db = dbClient.db();
    let zipRegEx = new RegExp(req.params.zips);
    let fields = {_id: false,
                    zips : true,
                    city : true,
                    state_id : true,
                    state_name : true,
                    country_name : true,
                    timezone: true};
    const cursor = db.collection("uscities").find({zips:zipRegEx}).project(fields);
    cursor.toArray(function(err, results) {
        console.log(results); // outup all records for debugbug only
        res.send(results);
    });
});

app.get('/uscities-search/:city', function (req, res) {
    const db = dbClient.db();
    let cityRegEx = new RegExp(req.params.city, 'i');

    let fields = {_id: false,
                    zips : true,
                    city : true,
                    state_id : true,
                    state_name : true,
                    country_name : true,
                    timezone: true};
    const cursor = db.collection("uscities").find({city:cityRegEx}).project(fields);
    cursor.toArray(function(err, results) {
        console.log(results); // debug outup all records
        res.send(results);

    });
    
});



/* these are old from Lab2
app.get('/echo.php', function (req, res) {
    var data = req.query.data
    res.send(data)
})
app.post('/echo.php', function (req, res) {
    var data = req.body['data']
    res.send(data)
})
*/
