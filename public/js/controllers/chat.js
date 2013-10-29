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
				user_id = this.get('user').primaryKeyValue(),
				title = params.title,
				description = params.description || 'Simple chat room';
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
		sendToUser: function(user) {
			var room_id = this.get('currentRoom').primaryKeyValue(),
				user_login = user.get('login'),
				input = $('input[data-id=' + room_id + ']');
				old_value = input.val();
			input.val(user_login + ', ' + old_value);
			input.focus();
			if (input.get(0).setSelectionRange) {
		    	input.get(0).setSelectionRange(input.val().length, input.val().length);
			} 
			else if (input.get(0).createTextRange) {
				var range = input.get(0).createTextRange();
				range.collapse(true);
				range.moveEnd('character', input.val().length);
				range.moveStart('character', input.val().length);
				range.select();
			}
		},
		sendMessage: function() {
			var self = this,
				currentRoom = this.get('currentRoom'),
				currentUser = this.get('user');
			var room_id = currentRoom.primaryKeyValue();
			var text = $('input[data-id=' + room_id + ']').val();
			var message = Chat.Message.createRecord({
				room: currentRoom.primaryKeyValue(),
				user: currentUser.primaryKeyValue(),
				message: text,
				time: moment().format("YYYY-MM-DD HH:mm:ss")
			});
			message.save();
			message.on('didFinishSaving', function() {
				$('input[data-id=' + room_id + ']').val('');
				self.socket.emit('newMessage', {
					room_id: currentRoom.primaryKeyValue(),
					user: currentUser.primaryKeyValue(),
					message: text,
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
		},
		newMessage: function(data) {
			console.log(data);
		}
	}
});
