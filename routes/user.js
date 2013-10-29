crypto = require('crypto');
uuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
module.exports = function(app, models) {
    //User login
    app.get('/api/users', function(req, res) {
        var hash = crypto.createHash('md5');
        var pass = hash.update(req.query.pass).digest('hex');
        models.User.findOne({login: req.query.login, pass: pass, loggedIn: req.query.loggedIn}, function(err, user) {
        	if (err) {
                res.json(500, {
                    error: err
                });
        	}
            else {
        		if (user) {
                    user.sessionId = uuid();
                    user.save(function(err) {
                        if (err) {
                            res.json(500, {
                                error: err
                            });
                        }
                        else {
                            delete user.pass;
                            res.json(200, [user]);
                        }
                    })

        		}
        		else {
        		    res.send(404, '');
        		}
            }
        });
    });
    app.get('/api/users/uuid/:id', function(req, res) {
        models.User.findOne({sessionId: req.params.id}, function(err, user) {
            if (err) {
                res.json(500, {
                    error: err
                });
            }
            else {
                if (user) {
                    res.json(200, user);
                }
            }
        });
    })
    //Get user data
    app.get('/api/users/:id', function(req, res) {
        models.User.findOne(req.id, function(err, user) {
            if (err) {
                res.json(500, {
                    error: err
                });
            }
            else {
                if (user) {
                    delete user.pass;
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
        var user = req.body;
        res.setHeader('Content-Type', 'application/json');
        if (user._id) {
            id = user._id;
            delete(user._id);
            user = models.User.findByIdAndUpdate(id, user, function(err) {
                if (err) {
                    res.json(500, {
                        error: err
                    });
                }
                else {
                    delete user.pass;
                    res.json(200, [user]);
                }
            });
        }
    	else {
            models.User.findOne({login: user.login}, function(err, result) {
                if (err) {
                    throw(err);
                }
                if (!result) {
                    var hash = crypto.createHash('md5');
                    var pass = hash.update(user.pass).digest('hex');
                    user = new models.User({login: user.login, name: user.name, pass: pass, loggedIn: false});
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
                                    delete user.pass;
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
    });
    //User logout
    // app.put('/api/users/:id', function(req, res) {
    //     models.User.findById(req.params.id, function(err, result) {
    //         result.set('loggedIn', false);
    //         result.
    //         result.save();
    //     });
    // });
};