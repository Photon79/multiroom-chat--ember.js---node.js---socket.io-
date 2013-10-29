//User login
module.exports = function(app, models) {
    app.get('/api/users', function(req, res) {
    	console.log('get /api/users');
        models.User.findOne({login: req.query.login, pass: req.query.pass, loggedIn: req.query.loggedIn}, function(err, user) {
        	if (err) {
                res.json(500, {
                    error: err
                });
        	}
            else {
        		if (user) {
        		    res.json(200, [user]);
        		}
        		else {
        		    res.send(404, '');
        		}
            }
        });
    });
    //Get user data
    app.get('/api/users/:id', function(req, res) {
        console.log('get /api/users/:id');
        models.User.findOne(req.id, function(err, user) {
            if (err) {
                res.json(500, {
                    error: err
                });
            }
            else {
                if (user) {
                    res.json(200, [user]);
                }
                else {
                    res.send(404, '');
                }
            }
        });
    });
    //Register and update user
    app.post('/api/users', function(req, res) {
    	console.log('post /api/users');
        var user = req.body;
        res.setHeader('Content-Type', 'application/json');
        if (!user._id) {
            models.User.findOne({login: user.login}, function(err, result) {
            	if (err) {
            		throw(err);
            	}
        		if (!result) {
        		    user = new models.User({login: user.login, name: user.name, pass: user.pass, loggedIn: user.loggedIn});
        		    user.save(function(err) {
        		    	if (err) {
        		    		res.json(500, {
                                error: err
                            });
        		    	}
                        else {
                            console.log('Register user');
                            userRoom = new models.UserRoom({user: user._id, room: []});
                            userRoom.save(function(err){
                                if(err) {
                                    res.json(500, {
                                        error: err
                                    });
                                }
                                else {
                                    res.json(200, [user]);
                                }
                            });
                        }
        		    });
        		}
                else {
                    res.json(404, {
                        error: 'User already exists'
                    });
                }
            });
        }
    	else {
            id = user._id;
            delete(user._id);
            user = models.User.findByIdAndUpdate(id, user, function(err) {
                if (err) {
                    res.json(500, {
                        error: err
                    });
                }
                else {
                    res.json(200, [user]);
                }
            });
    	}
    });
    //User logout
    app.put('/api/users/:id', function(req, res) {
        models.User.findById(req.params.id, function(err, result) {
            result.set('loggedIn', true);
            result.save();
        });
    });
};