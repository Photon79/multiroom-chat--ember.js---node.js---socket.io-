Chat.UserController = Em.ObjectController.extend({
	needs: ['chat'],
	loggedIn: false,
	user: null,
	content: [],
	actions: {
		logout: function() {
			this.set('loggedIn', false);
			var user = this.get('user');
			user.set('loggedIn', false);
			user.save();
			this.set('user', null);
			this.get('controllers.chat').set('loggedIn', false);
			this.get('controllers.chat').set('allRooms', []);
			this.get('controllers.chat').set('user', null);
		},
		loginUser: function(params) {
			var self = this;
			result = Chat.User.find({login: params.login, pass: CryptoJS.MD5(params.pass).toString(), loggedIn: false});
			result.on('didFinishLoading', function() {
				user = Chat.User.createRecord(result.get('content')[0]);
				user.set('loggedIn', true);
				user.save();
				self.set('user', user);
				self.set('loggedIn', true);
				self.get('controllers.chat').set('loggedIn', true);
				self.get('controllers.chat').set('allRooms', Chat.Room.find());
				self.get('controllers.chat').set('user', user);
			});
		},
		registerUser: function(params) {
			self = this;
			if (params.pass == params.pass2) {
				user = Chat.User.createRecord({
					login: params.login,
					name: params.name,
					pass: CryptoJS.MD5(params.pass).toString(),
					loggedIn: true
				});
				user.save();
				user.on('didFinishSaving', function() {
					self.set('user', user);
					self.set('loggedIn', true);
					self.get('controllers.chat').set('loggedIn', true);
					self.get('controllers.chat').set('allRooms', Chat.Room.find());
					self.get('controllers.chat').set('user', user);
				});
			}
		}
	}
});