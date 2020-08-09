const express = require('express')
const app = express()
var port = process.env.PORT || 8083;
//app.use(express.static('static'))
app.use (express.urlencoded({extended: false}))
const cors = require('cors');
app.use(cors());
app.listen(port)
console.log(" chat micro is running on port " + port)
app.get('/', (req, res) => {
    res.send("chat login Micorsercvice by Kaswan");
})
const MongoClient = require('mongodb').MongoClient;
const mongourl = "mongodb+srv://cca-kaswna1:AZg3zvPKXJFjmJW@cca-kaswana1-hdlxr.mongodb.net/cca-labs?retryWrites=true&w=majority"; //mongodb URL
const dbClient = new MongoClient(mongourl,
                {useNewUrlParser: true, useUnifiedTopology: true });
dbClient.connect(err => {
    if (err) throw err;
    console.log("conneted to MongoDB Chat")
});  

app.get('/login/:username/:password/', function (req, res) {
   const db = dbClient.db();
   let username = req.params.username;
   let password = req.params.password;
   db.collection("users").findOne({username:username,password:password},(err,user)=>{
       if(err||!user){console.log(`${username}/${password}not found!`);
       res.send( "check user name / password");//""handle the result accordingly
       }
       if(user&&user.username===username){console.log(`${username}/${password}found!`);
       res.send( "welcome");//handle the result accordingly
       }});
});

app.get('/register/:fullname/:username/:email/:password/', function (req, res) {
    const db = dbClient.db();
    let rusername = req.params.username;
    let rpassword = req.params.password;
    let fullname = req.params.fullname;
    let remail = req.params.email;
    
    db.collection("users").findOne({username:rusername},(err,user)=>
    {
        if(user){
            res.send( "user found");//handle the case of "failed"
        }else{
            let newUser={ 'fullname':fullname,'username':rusername,'password':rpassword, 'email':remail,}
            
            db.collection("users").insertOne(newUser,(err,result)=>{
                if(err){
                    res.send("Signup error"); //handle the case of "Signup error
                }
                res.send("Signup successful");//handle the case of "Signup successful"
            })
        }
    })
});