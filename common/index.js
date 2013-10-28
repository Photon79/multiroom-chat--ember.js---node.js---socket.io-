module.exports = function(app, express, path, io, mongoose, models) {
	sockets = require('./sockets')(io, models);
	db = require('./db')(mongoose);
	config = require('./config')(app, express, path);
}