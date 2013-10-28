Chat.ChatController = Em.ObjectController.extend({
	needs: ['user'],
	content: [],
	actions: {
		createRoom: function(params) {
			var self = this;
			var user = this.get('user');
			var title = params.title;
			var description = params.description;
			Em.set('Chat.MessageValue.value', '');
			var room = Chat.Room.createRecord({
				title: title,
				description: description,
				creator: user.primaryKeyValue()
			});
			room.save();
			room.on('didFinishSaving', function() {
				self.socket.emit('newRoom', {title: room.get('title'), id: room.primaryKeyValue()});
			});
		},
		sendToUser: function() {

		},
		sendMessage: function(params) {
			var self = this;
			var currentRoom = this.get('currentRoom');
			var currentUser = this.get('user');
			var message = Chat.Message.createRecord({
				room: currentRoom,
				user: currentUser,
				text: params.text,
				time: new Date()
			});
			message.save();
			message.on('didFinishSaving', function() {
				self.socket.emit('newMessage', {
					room_id: currentRoom.primaryKeyValue(),
					user: currentUser.get('login'),
					text: params.text,
					time: new Date()
				});
			});
		},
		leave_room: function(room) {
			var self = this;
			var user_id = this.get('user')._attributes['_id'];
			$.ajax({
				url: '/api/rooms/logout/' + room._id + '/' + user_id,
				method: 'POST',
				data: {
					_method: 'delete'
				},
				success: function(data) {
					var userRooms = self.get('userRooms');
					var idx = _.findIndex(userRooms, function(data) {
						return room._id == data._id;
					});
					userRooms.splice(idx, 1);
					self.set('userRooms', userRooms);
					self.socket.emit('leaveRoom', {user_id: user_id, room_id: room._id});
					$('li[data-id=' + room._id + ']').prev().remove();
					$('li[data-id=' + room._id + ']').next().remove();
					$('li[data-id=' + room._id + ']').remove();
					$('div[data-room=' + room._id + ']').prev().remove();
					$('div[data-room=' + room._id + ']').next().remove();
					$('div[data-room=' + room._id + ']').remove();
				},
				error: function(data) {
					console.log(data);
				}
			});
		},
		join_room: function(room) {
			self.socket.join(room);
		}
	},
	sockets: {
		reloadRoomList: function(data) {
			console.log('ReloadRoomList');
			this.set('allRooms', data);
		}
	}
});