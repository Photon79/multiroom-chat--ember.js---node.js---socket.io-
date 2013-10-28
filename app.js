var 
    express = require('express'),
    io = require('socket.io'),
    mongoose = require('mongoose'),
    http = require('http'),
    path = require('path');

var models = require('./models')(mongoose);

var app = express(),
    server = http.createServer(app),
    io = io.listen(server);

var common = require('./common')(app, express, path, io, mongoose, models);
var routes = require('./routes')(app, models);

// Define routes
app.get('/', function(req, res) {
    res.render('index');
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port') + ' in ' + (app.get('env')?'development':'production') + ' mode');
});
