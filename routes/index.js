module.exports = function(app, models) {
	var userRoutes = require('./user')(app, models);
	var chatRoutes = require('./chat')(app, models);
}
