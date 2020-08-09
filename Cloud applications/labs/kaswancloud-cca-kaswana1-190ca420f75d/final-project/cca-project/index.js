const express = require('express');
const app = express();
var port = process.env.PORT || 8080; //important for deployment later
const server = require('http').createServer(app);
const io = require('socket.io')(server);
server.listen(port); //changed from app.listen(port)
app.use(express.static('static'));
app.use(express.urlencoded({extended: false}));
const https=require('https');
const http=require('http');
var chatdb = require('./chatdb');
// console.log("chatdb",chatdb);

//mongo connection
var db={};
const MongoClient = require('mongodb').MongoClient;
const mongourl = "mongodb+srv://cca-project:i74LBqA1YjUAyz6n@cca-project.cripc.mongodb.net/cca-project?retryWrites=true&w=majority"  //full url with username and password
//const mongourl = "mongodb+srv://cca-project:i74LBqA1YjUAyz6n@cca-project.cripc.mongodb.net/cca-project?retryWrites=true&w=majority"  //full url with username and password
const dbClient = new MongoClient(mongourl, {useNewUrlParser: true, useUnifiedTopology: true});
dbClient.connect(err=>{
    if(err) throw err;
    db = dbClient.db();
    console.log("Connected to the MongoDB cluster");
});
console.log("Project Webchat Running on PORT " + port);
app.get("/",(req,res)=>{
    res.sendFile(__dirname + '/static/chatclient.html')
})
io.on('connection', (socketclient) =>{
    console.log('A new client is connected!');/*code to handle*/    
    
    socketclient.chathistory = {}
    var onlineClients = Object.keys(io.sockets.sockets).length;
    var welcomemessage = `Number of People active is system : "${onlineClients}" `
    console.log(welcomemessage);
    io.emit("online",welcomemessage);

    socketclient.on('disconnect', () =>{
        var onlineClients = Object.keys(io.sockets.sockets).length;
        var byemessage = `Number of People active is system : "${onlineClients}" `
        console.log(byemessage);
        io.emit("online",byemessage);
        refreshusers();
    });
    socketclient.on("message", (data) => {
        console.log('Data from a client: ' + data);
        io.emit("message", `${socketclient.username} says: ${data}`);
    });
    socketclient.on("typing", () => {
        console.log('Someone is typing');
        //for debugging only
        socketclient.broadcast.emit("typing", `${socketclient.username} is typing...`)
        //send to all connected clients expect the sender
    });

    socketclient.on("requestChatHistory", (receiver,sender) => {
       // console.log('Data from a client: ' + data);
       // io.emit("message", `${socketclient.username} says: ${data}`);
        requestChatHistory(receiver,sender);
    });

    
    socketclient.on("login", (username,password) => {
        console.log(`Debug> Login data: ${username}/${password}`);
        console.log("level 1")
        // login(username,password,(authenticated,message,account) => {
        //     if (authenticated){
        //         socketclient.authenticated=true;
        //         socketclient.username=username;
        //         refreshusers()
        //         //socketclient.account=account;
        //         //socketclient.emit("authenticated",account);
        //         //console.log(`debug > ${username} is authnticated. account:`);
        //         //var onlineClients = Object.keys(io.sockets.sockets).length;
        //         //BroadcastAuthenticatedClients("online", `${socketclient.username} is connected.`);
                   var welcomemessage = `Number of People active is system : "${onlineClients}" `
        //             console.log(welcomemessage);
                    // socketclient.emit("online",welcomemessage);
        //     }
        // })
       
        http.get('http://cca-kaswan-webchatservices.herokuapp.com/login/'+username+'/'+password,

        
       
            (resp)=>{
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                const result = JSON.parse(data);
            
                console.log("result",result);

                if (!result.status){
                    //error, handle accordingly
                     socketclient.emit("login-failed","Unable to login");
                } else{
                   socketclient.authenticated=true;
                    socketclient.username=username;
                    // socketclient.account= account;
                    // socketclient.emit("authenticated");
                    console.log(`Debug> ${username} is authenticated`);

                    var sockets1 = io.sockets.sockets;
                    for (var id in sockets1){
                        const socketclient1 = sockets1[id];
                        if(socketclient1 && socketclient1.authenticated){
                            console.log("authenticated"+username);
                            socketclient1.emit("authenticated"+username,result.userObj);
                        }
                    }
                    refreshusers();
                }
            });
        });


    });

    socketclient.on("signUp", (username,password,fullname,email) => {
      

        http.get('http://cca-kaswan-webchatservices.herokuapp.com/signUp/'+username+'/'+password+'/'+fullname+'/'+email,


            (resp)=>{
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                const result = JSON.parse(data);
                if (!result){
                    //error, handle accordingly
                     socketclient.emit("signUp-failed","Unable to sign up");
                } else{
                   socketclient.authenticated=true;
                    socketclient.username=username;
                    // socketclient.account= account;
                    // socketclient.emit("authenticated");
                   // console.log(`Debug> ${username} is authenticated`);

                    var sockets1 = io.sockets.sockets;
                    for (var id in sockets1){
                        const socketclient1 = sockets1[id];
                        if(socketclient1 && socketclient1.authenticated){
                            socketclient1.emit("signUp-success","Sign up successful");
                        }
                    }
                }
            });
        });
    });

    socketclient.on("privatechat",(receiver, msg) =>{
        console.log("err reciever ", receiver, msg)
        let sockets = io.sockets.sockets
         chatdb.storePrivateMessage({
            receiver:receiver,
            sender:msg.sender,
            msg:msg.message
        },function(err,data){
           console.log("err,data",err,data);
           if(err){
               io.emit("privatechaterror"+ socketclient.username, "unable to send message")

           }else{
            for (let id in sockets) {
            let socketclientreceiver = sockets[id]
            if (socketclientreceiver.username == receiver){
                socketclientreceiver.emit("privatechat", socketclient.username, msg.message)
                let sender = {"sender":socketclient.username, "receiver": socketclientreceiver.username, "message": msg.message}
                let chattemp = []
                if (socketclient.chathistory[receiver] != null) {
                    chattemp = socketclient.chathistory[receiver]
                }
                else {
                    socketclient.chathistory[receiver]=[]
                }
                chattemp.push(sender)
                socketclient.chathistory[receiver] = chattemp
                chattemp = []
                if(io.sockets.sockets[id].chathistory[socketclient.username] !=null) {
                    chattemp = io.sockets.sockets[id].chathistory[socketclient.username]
                }
                else {
                    io.sockets.sockets[id].chathistory[socketclient.username] = []

                }
                chattemp.push(sender)
                io.sockets.sockets[id].chathistory[receiver] = chattemp
                socketclientreceiver.emit("privatechat", socketclient.username, msg.message)
            }
        }
           }

        });     
    })
    socketclient.on("chathistory",(username) =>{
        console.log(socketclient.chathistory)
        socketclient.emit("chathistory",username, socketclient.chathistory[username])
    })
});

function login(username,password,callback){
    console.log("level 2")
    db.collection("users").
    findOne({
        username:username,
        password:password
    },(err, user)=>{
        if(err || !user){   
            console.log(`${username}/${password} not found!`);
            return callback({status:false,userObj:user}); //(false,"login failed",null); //handle the result accordingly
        }
        if(user && user.username===username){
            console.log(`${username}/${password} found!`);
            return callback({status:true,userObj:user}); //handle the result accordingly
        }
    });
}

function signUp(username,password,fullname,email,callback){

    db.collection("users").findOne({username:username},(err, user)=>{
        if (user){
            return callback(false,"Username exist",null); //handle the case of "failed"
        }else{
            let newUser = {username:username,password:password,fullname:fullname,email:email};
            db.collection("users").insertOne(newUser,(err,result)=>{
                if(err){
                    return callback(false,"Username exist",null);//handle the case of "Signup error"
                }else{
                    return callback(true,null,user); //handle the case of "Signup successful"
                }
            });
        }
    });

}

function conversation(event,message){
    let sockets = io.sockets.sockets
    for (let id in sockets){
        const socketclient = sockets[id]
        if (socketclient.authenticated){
            socketclient.emit(event,message)
        }
    }
}
function onlineusers(){
    let sockets = io.sockets.sockets
    let activeusers=new Map()
    for (var id in sockets){
        const socketclient = sockets[id]
        if (socketclient && socketclient.user.authenticated){
           activeusers.set(socketclient.user.username,socketclient.user.username)
        }
    }
    return activeusers.size
}
function refreshusers(){
    var sockets = io.sockets.sockets
    let activeusers=new Map()
    for (var id in sockets){
        const socketclient = sockets[id]
        if (socketclient && socketclient.authenticated){
           activeusers.set(socketclient.username,JSON.parse('{"username":"'+socketclient.username+'","fullname":"' + socketclient.username+'"}'))
        }
    }
    let activeusersJSON = []
    activeusers.forEach((value,key)=>{
        activeusersJSON.push(value)
    })
    conversation("activeuserslist", JSON.stringify(activeusersJSON))
}

function requestChatHistory(receiver,sender){
    console.log("receiver,sender",receiver,sender)
    chatdb.loadPrivateMessage({
            receiver:receiver,
            sender:sender
        },function(err,data){
            console.log("err,data",err,data);
            io.emit("loadPrivateMessage", data)

        });
}
