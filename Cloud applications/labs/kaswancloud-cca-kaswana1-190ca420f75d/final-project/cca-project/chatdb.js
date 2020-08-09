var db={};
const MongoClient = require('mongodb').MongoClient;
const mongourl = "mongodb+srv://cca-project:i74LBqA1YjUAyz6n@cca-project.cripc.mongodb.net/chatDB?retryWrites=true&w=majority"  //full url with username and password
const dbClient = new MongoClient(mongourl, {useNewUrlParser: true, useUnifiedTopology: true});
dbClient.connect(err=>{
    if(err) throw err;
    db = dbClient.db();
    console.log("Connected to the MongoDB cluster");
});

module.exports.storePrivateMessage = function(data,callback){
    db.collection("chats").insert({
        sender:data.sender,
        receiver:data.receiver,
        msg:data.msg,
        timestamp: new Date()
    },callback);
}

module.exports.loadPrivateMessage = function(data,callback){
    db.collection("chats").find({
       $or:[ {
           sender:data.sender, 
           receiver:data.receiver
        },
        {
            sender:data.receiver, 
            receiver:data.sender
        }]
    }).sort({timestamp:1}).limit(100).toArray(callback) 
}



       