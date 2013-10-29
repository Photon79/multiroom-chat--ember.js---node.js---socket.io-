module.exports = function(io, models) {
	io.sockets.on('connection', function(socket) {
		socket.on('newMessage', function(data) {
			console.log('newMessage');
			socket.broadcast.to(data.room_id).emit('newMessage', data);
		});
		socket.on('newRoom', function(data) {
			console.log('newRoom', data);
			models.Room.find(function(err, rooms) {
				if (!err) {
					io.sockets.emit('reloadRoomList', rooms);
				}
				models.UserRoom.find({user: data.user_id}, function(err, userRoom) {
					console.log(userRoom);
					if (!err && userRoom && userRoom.length > 0) {
						userRoom = userRoom[0];
						var room_ids = [];
						_.each(userRoom.room, function(id) {
							room_ids.push(new ObjectID(id.toString()));
						});
						models.Room.find({_id: {$in: room_ids}}, function(err, rooms) {
							if (!err && rooms) {
								socket.emit('reloadUserRooms', rooms);
							}
						});
					}
				});
			});

		});
		socket.on('joinUser', function(data) {
			console.log('joinUser');
			socket.join(data.room_id);
			socket.broadcast.to(data.room_id).emit('joinUser', data);
		});
		socket.on('leaveRoom', function(data) {
			socket.broadcast.to(data.room_id).emit('leaveUser', data.user_id);
			models.UserRoom.find({user: data.user_id}, function(err, userRoom) {
				if (!err && userRoom) {
					userRoom = userRoom[0];
					var room_ids = [];
					_.each(userRoom.room, function(id) {
						room_ids.push(new ObjectID(id.toString()));
					});
					models.Room.find({_id: {$in: room_ids}}, function(err, rooms) {
						if (!err && rooms) {
							socket.emit('reloadUserRooms', rooms);
							socket.leave(data.room_id);
						}
					});
				}
			});
		});
		socket.on('deleteRoom', function(data) {
			socket.broadcast.to(data).emit('deleteRoom');
			models.Room.find(function(err, rooms) {
				if (!err) {
					io.sockets.emit('reloadRoomList', rooms);
				}
			});
		});
	});
};