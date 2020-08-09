const express = require('express')
const app = express()
var port = process.env.PORT || 8082; // for deployment
const server = require('http').createServer(app);
const io = require('socket.io')(server);
server.listen(port); //server listening port
app.use(express.static('static'))
app.use (express.urlencoded({extended: false}));
console.log("webchat is running @ " + port);

app.get('/', (require, res) => {
    res.sendFile(__dirname + '/static/chatclient.html');
})
io.on('connection', (socketclient) => {
    console.log('new client connected!!!')
    socketclient.authenticated = false
    socketclient.username = ''
    socketclient.on("login", (username,password) => {
        console.log("login data user : username="+username + ";password="+password);
        if (username !="" && password !=""){
            login(username,password,(authenticated,message,account)=>{
                if (authenticated){
                    socketclient.authenticated=true;
                    socketclient.username=username;
                    socketclient.password=password;
                    socketclient.account=account;
                    socketclient.emit("authenticated","1");
                    //console.log("autherized : username=" +username);
                    let welcomemessage=`${socketclient.username} : is connected!! Number of connected client: ${getOnlineCount()}`
                    sendMessage("online", welcomemessage);
                }
                    else{
                        socketclient.authenticated=false;
                        socketclient.emit("authenticated","0");
                    }
            })
        }
            else{socketclient.emit("authenticated","0");
            }
    })

    socketclient.on("register",(fullname,username,email,password)=>{
        register(fullname,username,email,password,(registered,message,account)=>{
            if (user != "" && password != "" && fullname != "" && email != ""){
                if (registered){
                    socketclient.registered = true;
                    socketclient.emit("registered","1");
                    console.log("registration user already present: username="+ username)
                } else{
                    if (message = "user already present in db"){
                        socketclient.emit("registered","2")
                    } else{
                        socketclient.emit("registered","0")
                    }console.log("error while registering:=" +message)
                }
            }
        })
    })
        
        


    socketclient.on("typing", () => {
        console.log('Someone is typing...');
        socketclient.broadcast.emit("typing", `${socketclient.id} is typing...`);
    });
    socketclient.on("message",(data)=>{
        if(socketclient.authenticated){
            console.log("Data from a client:" + data)
            sendMessage("message",`${socketclient.username} says: ${data}`);
        }
    })
    socketclient.on('disconnect', () => {
    var onlineClients = Object.keys(io.sockets.sockets).length;
    var byemessage = `${socketclient.id} is diconnected! Number of Connected Clients: ${onlineClients}`;
    console.log(byemessage);
    io.emit("online", byemessage);
    });

    
});

function login(username,password,callback) {
    //next call the authentication microcervices
    // just for testing
    console.log("inside login function : username="+username + ";password="+password);

    const https=require('https');
    https.get('https://cca-project-kaswan-ragini-microservice.azurewebsites.net/login/' +username + '/' +password,(resp)=>{
        let data = "";
        resp.on('data', (chunk)=>{
            data +=chunk ;
        });
        resp.on('end',()=>{
            if(data=="notfound"){
                callback(false,"not found", null);
            }else{
                callback(true,"user found",data);
            }
        })
    })
}

function register(fullname,username,email,password,callback){
    https.get('https://cca-project-kaswan-ragini-microservice.azurewebsites.net/register/'+fullname+'/'+username+'/'+email+'/'+password,(resp)=>{
        let data = '';
        resp.on('data',(chunk)=>{
            data += chunk;
        });
        resp.on('end',()=>{
            console.log("Registration Response: " + data)
            //const result = JSON.parse(data);
            if(data=="true"){
                callback(true,"user register",data)
            }else{
                callback(false,"registration failed",null)
            }
        })
    });
}

function sendMessage(event,message){
    let sockets = io.sockets.sockets;
    for (let id in sockets){
        const socketclient = sockets[id];
        if (socketclient.authenticated){
            socketclient.emit(event,message);
        }
    }
}

function getOnlineCount(){
    let sockets = io.sockets.sockets;
    let count = 0;
    for(let id in sockets){
        const socketclient=sockets[id];
        if(socketclient.authenticated){
            count=count+1
        }
    }return count
}



