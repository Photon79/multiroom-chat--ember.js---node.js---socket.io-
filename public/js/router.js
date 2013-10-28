Chat.Router.map(function() {
	this.route('index', {path: '/'});
});

Chat.IndexRoute = Em.Route.extend({
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