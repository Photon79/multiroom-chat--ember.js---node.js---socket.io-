Chat.Router.map(function() {
	this.route('index', {path: '/'});
});

Chat.IndexRoute = Em.Route.extend({
	model: function() {
		var self = this;
		var uuid = null;
		if (uuid = Chat.authCookie()) {
			Em.$.ajax({
				url: '/api/users/uuid/' + uuid,
				method: "GET",
				success: function(data) {
					var userController = Chat.__container__.lookup('controller:user'),
						chatController = Chat.__container__.lookup('controller:chat');
					user = Chat.User.createRecord(data);
					userController.set('user', user);
					userController.set('loggedIn', true);
					chatController.set('loggedIn', true);
					chatController.set('user', user);
					chatController.getUserRooms();
					chatController.getRoomUsers();
					chatController.set('allRooms', Chat.Room.find());
				},
				error: function(err) {

				}
			});
		}
	},
	renderTemplate: function() {
		this.render('index');
		this.render('user', {
	      into: 'index',
	      outlet: 'login',
	      controller: 'user'
	    });
	    this.render('chat', {
	      into: 'index',
	      outlet: 'chat',
	      controller: 'chat'
	    });
	    this.render('chat/main', {
	    	into: 'chat',
	    	outlet: 'main',
	    	controller: 'chat'
	    });
	    this.render('chat/list', {
	    	into: 'chat',
	    	outlet: 'list',
	    	controller: 'chat'
	    })
	}
});