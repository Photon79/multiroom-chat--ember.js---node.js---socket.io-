Chat.IndexController = Ember.ObjectController.extend({
	needs: ['user', 'chat'],
	init: function() {
		console.log(this.get('content'));
	}
});