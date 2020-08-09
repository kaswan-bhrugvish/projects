var http = require("http");
var server = http.createServer(httphandler);
var port = process.env.PORT || 8080;
server.listen(port);
console.log("httpserver is running at port: " + port);
const { error } = require("console");
const fs = require("fs"), url = require('url');
// --GET POST request starts here-- //
const querystring = require('querystring');
function httphandler(request,response) {
    console.log("Get an HTTP Request: " + request.url);
    var fullpath = url.parse(request.url, true);
    if (fullpath.pathname ==="/echo.php") {
        if (request.method=="GET") {
            //parsing the input from the query
            var query = querystring.parse(querystring.stringify(fullpath.query));
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(query.data);
            return response.end();
        }
        else if (request.method=="POST") {
            let postdata = '';
            //reading input data from request stream
            request.on('data', (chunk) => {
                postdata +=chunk;
            });
            request.on('end', () => {
                postdata = querystring.parse(postdata);
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(postdata.data);
                return response.end();
            });
        }
        return;
    } // --GET POST end -- // 

    var localfile = ".." + fullpath.pathname; 
    //we serve files in this parent folder
    console.log("Debug: Server's local file: " + localfile);
    fs.readFile(localfile, (error, filecontent) => {
        if (error) {
            response.writeHead(404);
            return response.end(fullpath.pathname + " is not found on this server.");
        }
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(filecontent);
        return response.end();

    })
    //response.writeHead(200, {'Content-Type': 'text/html'});
    //response.write("You have requested " + request.url);
    //return response.end();
}