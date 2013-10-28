_ = require('lodash');
ObjectID = require('mongodb').ObjectID;
module.exports = function(app, models) {
	app.get('/api/rooms', function(req, res) {
		models.Room.find(function(err, rooms) {
			if (err) {
				res.json(500, {
					error: err
				});
			}
			else {
				res.json(200, rooms);
			}
		});
	});
	app.get('/api/rooms/logout', function(req, res) {
	});
	app.get('/api/rooms/user/:id', function(req, res) {
		models.UserRoom.find({user: req.params.id}, function(err, userRoom) {
			userRoom = userRoom[0];
			if (err) {
				res.json(500, {
					error: err
				});
			}
			else {
				console.log(userRoom);
				models.Room.find({_id: {$in: userRoom.room}}, function(data) {
					res.json(200, data);
				});
			}
		});
	});
	app.get('/api/rooms/:id/users', function(req, res) {
	});
	app.get('/api/rooms/:id', function(req, res) {
	});
	app.post('/api/rooms', function(req, res) {
		console.log(req.body);
		models.User.findOne(req.body.creator, function(err, user) {
			if (err) {
				res.json(500, {
					error: err
				});
			}
			else {
				room = new models.Room({creator: user._id, title: req.body.title, description: req.body.description || 'Simple chat room'});
				room.save(function(err) {
					console.log('New Room created');
					if (err) {
						res.json(500, {
							error: err
						});
					}
					else {
						models.UserRoom.findOne({user: user._id}, function(err, userRoom) {
							if (err) {
								res.json(500, {
									error: err
								});
							}
							else {
								if (userRoom) {
									console.log('UserRoom found');
									userRoom.room.push(room._id);
									userRoom.save(function(err) {
										if (err) {
											res.json(500, {
												error: err
											});
										}
										else {
											res.send(200, '');
										}
									});
								}
								else {
									console.log('Create new UserRoom');
									userRoom = new models.UserRoom({user: user._id});
									userRoom.room.push(room._id);
									userRoom.save(function(err) {
										if (err) {
											res.json(500, {
												error: err
											});
										}
										else {
											res.send(200, '');
										}
									});
								}
							}
						});
					}
				});
			}
		});
	});
	app.del('/api/rooms/:id', function(req, res) {
	});
};