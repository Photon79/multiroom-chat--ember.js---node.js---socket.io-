Chat.Router.map(function() {
	this.route('index', {path: '/'});
});

Chat.IndexRoute = Em.Route.extend({
	model: function() {
		var self = this;
		var uuid = null;
		var promise = Em.Deferred.create();
		if (uuid = Chat.authCookie()) {
			Em.$.ajax({
				url: '/api/users/uuid/' + uuid,
				method: "GET",
				success: function(data) {
					// this.controllerFor('user').set('user', data);
					// this.controllerFor('chat').set('user', data);
					// this.controllerFor('chat').getUserRooms();
					// this.controllerFor('chat').getRoomUsers();
					// this.controllerFor('chat').set('allRooms', Chat.Room.find());
					Chat.authCookie(data.sessionId);
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