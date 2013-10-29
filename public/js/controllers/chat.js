/*
 * TODO: validate all input fields
 */
Chat.ChatController = Em.ObjectController.extend({
	needs: ['user'],
	content: [],
	user: null,
	allRooms: [],
	userRooms: [],
	currentRoom: null,
	actions: {
		createRoom: function(params) {
			var self = this,
				user_id = this.get('user._id'),
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
		delete_room: function(room) {
			var self = this;
			var room_id = room.primaryKeyValue();
			this.store.deleteRecord(room).then(function() {
				self.socket.emit('deleteRoom', room_id);
				self.getUserRooms();
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
		join_room: function(room) {
			var room_id = room.primaryKeyValue(),
				user_id = this.get('user').primaryKeyValue();
			this.socket.emit('joinRoom', {room_id: room_id, user_id: user_id});
			this.set('currentRoom', room);
		},
		leave_room: function(room) {
			var self = this,
				user_id = this.get('user').primaryKeyValue(),
				room_id = room.primaryKeyValue();
			$.ajax({
				url: '/api/rooms/logout/' + room_id + '/' + user_id,
				method: 'POST',
				data: {
					_method: 'delete'
				},
				success: function(data) {
					var now = new Date().getTime() / 1000;  
	 				console.log('leave_room success', now);
					self.socket.emit('leaveRoom', {user_id: user_id, room_id: room_id});
				},
				error: function(err) {
				}
			});
		},
		refreshUserList: function(room) {
			this.set('currentRoom', room);
			this.getRoomUsers();
		}
	},
	getUserRooms: function() {
		var self = this,
			user_id = this.get('user').primaryKeyValue();
		$.ajax({
			url: '/api/rooms/user/' + user_id,
			method: 'GET',
			success: function(data) {
				var rooms = [];
				_.each(data, function(room) {
					rooms.push(Chat.Room.createRecord(room));
				})
				self.set('userRooms', rooms);
			},
			error: function(err) {

			}
		})
	},
	getRoomUsers: function() {
		var self = this;
		var curRoom = this.get('currentRoom');
		if (curRoom) {
			var room_id = curRoom.primaryKeyValue();
			$.ajax({
				url: '/api/rooms/' + room_id + '/users',
				method: 'GET',
				success: function(data) {
					var users = [];
					_.each(data, function(user) {
						users.push(Chat.User.createRecord(user));
					})
					self.set('currentRoomUsers', users);
				},
				error: function(err) {

				}
			});
		}
	},
	sockets: {
		reloadRoomList: function(data) {
			var rooms = [];
			_.each(data, function(room) {
				rooms.push(Chat.Room.createRecord(room));
			})
			this.set('allRooms', rooms);
		},
		reloadUserRooms: function(data) {
			var users = [];
			_.each(data, function(user) {
				users.push(Chat.User.createRecord(user));
			})
			this.set('userRooms', users);
		},
		joinRoom: function() {
			this.getRoomUsers();
		},
		leaveRoom: function() {
			this.getRoomUsers();
		}
	}
});
