module.exports = function(app, express, path) {
	var allowCrossDomain = function(req, res, next) {
	    res.header('Access-Control-Allow-Origin', '*');
	    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	    if ('OPTIONS' == req.method) {
	      res.send(200);
	    }
	    else {
	      next();
	    }
	};
	var hackDeleteHeaders = function(req, res, next) {
	  if (req.method === 'DELETE') {
	    delete req.headers['transfer-encoding'];
	  }
	  next();
	}

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.use(express.logger('dev'));
	app.set('view options', {layout: false});
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');
	app.set('views', __dirname + '/../views');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('KmRpZL07'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, '..', 'public')));
	app.use(allowCrossDomain);
	app.use(hackDeleteHeaders);

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}
};