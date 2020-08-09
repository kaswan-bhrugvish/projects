const express = require('express')
const app = express()
var port = process.env.PORT || 8080; // for deployment
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

    var onlineClients = Object.keys(io.sockets.sockets).length;
    var welcomemessage = `${socketclient.id} is connected! Number of Connected Clients: ${onlineClients}`;
    console.log(welcomemessage);
    io.emit("online", welcomemessage);

    socketclient.on("message", (data) => {
        console.log('data from the client: ' + data);
        io.emit("message",`${socketclient.id} says: ${data}`);
    });
    socketclient.on("typing", () => {
        console.log('Someone is typing...');
        socketclient.broadcast.emit("typing", `${socketclient.id} is typing...`);
    });

    socketclient.on('disconnect', () => {
    var onlineClients = Object.keys(io.sockets.sockets).length;
    var byemessage = `${socketclient.id} is diconnected! Number of Connected Clients: ${onlineClients}`;
    console.log(byemessage);
    io.emit("online", byemessage);
    });

    
});




/*
app.get('/echo.php', function (req, res) {
    var data = req.query.data
    res.send(data)
})
app.post('/echo.php', function (req, res) {
    var data = req.body['data']
    res.send(data)
})
*/

