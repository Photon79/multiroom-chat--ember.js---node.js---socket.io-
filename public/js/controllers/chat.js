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
		}
	},
	sockets: {
		reloadRoomList: function(data) {
			console.log('ReloadRoomList');
			this.set('allRooms', data);
		}
	}
});