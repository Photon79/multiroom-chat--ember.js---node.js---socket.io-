module.exports = function(io, models) {
	io.sockets.on('connection', function(socket) {
		socket.on('newMessage', function(data) {
			console.log('newMessage');
			socket.broadcast.to(data.room_id).emit('newMessage', data);
		});
		socket.on('newRoom', function(data) {
			console.log('newRoom');
			models.Room.find(function(err, rooms) {
				if (!err) {
					io.sockets.emit('reloadRoomList', rooms);
				}
			});
		});
		socket.on('joinUser', function(data) {
			console.log('joinUser');
			socket.broadcast.to(data.room_id).emit('joinUser', data);
		});
	});
};