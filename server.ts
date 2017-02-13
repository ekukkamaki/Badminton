import http = require('http');
import server = require('./src/server');
var port = process.env.port || 1337
var app = server.Server.bootstrap().app;

http.createServer(app).listen(port);