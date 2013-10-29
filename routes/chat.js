_ = require('lodash');
ObjectID = require('mongodb').ObjectID;
module.exports = function(app, models) {
	// Get room list
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
	// Get room data
	app.get('/api/rooms/:id', function(req, res) {
		models.Room.find(req.params.id, function(err, room) {
			if (err) {
				res.json(500, {
					error: err
				});
			}
			else {
				res.json(200, room);
			}
		});
	});
	// Get room users
	app.get('/api/rooms/:id/users', function(req, res) {
		models.UserRoom.find({room: new ObjectID(req.params.id)}, function(err, rooms) {
			if (err) {
				res.json(500, {
					error: err
				});
			}
			else {
				var user_ids = [];
				_.each(rooms, function(room) {
					user_ids.push(new ObjectID(room.user));
				});
				models.User.find({_id: {$in: user_ids}}, function(err, users){
					if (err) {
						res.json(500, {
							error: err
						});
					}
					else {
						res.json(200, users);
					}
				});
			}
		});
	});
	// Get rooms where user is joined in
	app.get('/api/rooms/user/:id', function(req, res) {
		models.UserRoom.find({user: req.params.id}, function(err, userRoom) {
			if (err) {
				res.json(500, {
					error: err
				});
			}
			else {
				if (userRoom) {
					userRoom = userRoom[0];
					var room_ids = [];
					_.each(userRoom.room, function(id) {
						room_ids.push(new ObjectID(id.toString()));
					});
					models.Room.find({_id: {$in: room_ids}}, function(err, rooms) {
						if (err) {
							res.json(500, {
								error: err
							});
						}
						else {
							res.json(200, rooms);
						}
					});
				}
				else {
					res.send(404, '')
				}
			}
		});
	});
	// Create room
	app.post('/api/rooms', function(req, res) {
		models.User.findOne(req.body.creator, function(err, user) {
			if (err) {
				res.json(500, {
					error: err
				});
			}
			else {
				var room = new models.Room({creator: user._id, title: req.body.title, description: req.body.description});
				room.save(function(err) {
					if (err) {
						res.json(500, {
							error: err
						});
					}
					else {
						models.UserRoom.findOne({user: user._id.toString()}, function(err, userRoom) {
							if (err) {
								res.json(500, {
									error: err
								});
							}
							else {
								if (userRoom) {
									userRoom.room.push(room._id);
									userRoom.save(function(err) {
										if (err) {
											res.json(500, {
												error: err
											});
										}
										else {
											res.json(200, room);
										}
									});
								}
								else {
									userRoom = new models.UserRoom({user: user._id.toString()});
									userRoom.room.push(room._id);
									userRoom.save(function(err) {
										if (err) {
											res.json(500, {
												error: err
											});
										}
										else {
											res.json(200, room);
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
	// Delete room
	app.delete('/api/rooms/:id', function(req, res) {
		models.Room.findOne({_id: new ObjectID(req.params.id)}, function(err, room) {
			if (err) {
				res.json(500, {
					error: err
				});
			}
			else {
				room.remove();
				models.UserRoom.find({room: new ObjectID(req.params.id)}, function(err, rooms) {
					if (err) {
						res.json(500, {
							error: err
						});
					}
					else {
						_.each(rooms, function(userRoom) {
							var i = -1;
							_.each(userRoom.room, function(id) {
								i++;
								if (id.toString() === req.params.id) {
									return;
								}
							});
							if (i > -1) {
						 		userRoom.room.splice(i, 1);
						 		userRoom.save();
						 	}
						});
					}
				});
				res.send(200, '');
			}
		});
	});
	// Join to room
	app.post('/api/rooms/:room_id/:user_id', function(req, res) {

	});
	// Leave room
	app.delete('/api/rooms/logout/:id/:user_id', function(req, res) {
		models.UserRoom.find({user: req.params.user_id}, function(err, userRoom) {
			if (err) {
				res.json(500, {
					error: err
				});
			}
			else {
				if (userRoom) {
					userRoom = userRoom[0];
					var i = 0;
					_.each(userRoom.room, function(id) {
						if (id.toString() === req.params.id) {
							return;
						}
						i++;
					});
			 		userRoom.room.splice(i, 1);
			 		userRoom.save();
					res.send(200, '');
				}
				else {
					res.send(404, '');
				}
			}
		});
	});
};