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
	// Leave room
	app.get('/api/rooms/logout', function(req, res) {
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
		console.log(req.params.id);
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
							console.log(rooms);					
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
						models.UserRoom.findOne({user: user._id.toString()}, function(err, userRoom) {
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
									userRoom = new models.UserRoom({user: user._id.toString()});
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
	// Delete room
	app.del('/api/rooms/:id', function(req, res) {
	});
};