Chat.ChatController = Em.ObjectController.extend({
	needs: ['user'],
	content: [],
	user: null,
	allRooms: [],
	userRooms: [],
	actions: {
		createRoom: function(params) {
			var self = this,
				user_id = this.get('user')._attributes['_id'],
				title = params.title,
				description = params.description || 'Simple chat room';
			Em.set('Chat.MessageValue.value', '');
			var room = Chat.Room.createRecord({
				title: title,
				description: description,
				creator: user_id
			});
			room.save();
			room.on('didFinishSaving', function() {
				self.socket.emit('newRoom', {title: room.get('title'), id: room.primaryKeyValue(), user_id: user_id});
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
					self.socket.emit('leaveRoom', {user_id: user_id, room_id: room._id});
				},
				error: function(data) {
					console.log(data);
				}
			});
		},
		delete_room: function(room) {
			var room_id = room.primaryKeyValue();
			this.store.deleteRecord(room);
			this.socket.emit('deleteRoom', room_id);
			this.getUserRooms();
		},
		join_room: function(room) {
			this.socket.emit('joinRoom', {room_id: room.primaryKeyValue(), user_id: this.get('user')._attributes['_id']});
		}
	},
	getUserRooms: function() {
		var self = this;
		var user_id = this.get('user')._attributes['_id'];
		$.ajax({
			url: '/api/rooms/user/' + user_id,
			method: 'GET',
			success: function(data) {
				self.set('userRooms', data);
			},
			error: function(data) {

			}
		})
	},
	sockets: {
		reloadRoomList: function(data) {
			console.log('ReloadRoomList');
			this.set('allRooms', Chat.Room.find());
		},
		reloadUserRooms: function(data) {
			console.log('ReloadUserRooms');
			this.set('userRooms', data);
		}
	}
});
