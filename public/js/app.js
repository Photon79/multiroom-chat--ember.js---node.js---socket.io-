window.Chat = Em.Application.create({
	title: "Simple chat with multiroom support",
	Socket: ES.Module.extend({
		host: 'localhost',
		port: 3000,
		controllers: ['chat']
	}),
	lastSessionToken: null,
	authCookie: function(value) {
		if (arguments.length) {
			if (value) {
				Em.$.cookie('chat_sid', value);
			}
			else {
				Em.$.removeCookie('chat_sid');
			}
		}
		res = Em.$.cookie('chat_sid');
		if (res) {
			this.set('lastSessionToken', res);
		}
		return res;
	}
});

Chat.Store = Emu.Store.extend({
	revision: 1,
	adapter: Emu.RestAdapter.extend({
		url: "http://localhost:3000",
		namespace: 'api',
		bulkCommit: false
	})
});

Em.$(document).on('tab.shown', 'a[data-toggle="tab"]', function (e) {
	Em.$(e.target).parent().addClass('btn-primary');
  	Em.$(e.relatedTarget).parent().removeClass('btn-primary');
});

Em.$(document).on('shown', '#createRoom', function() {
	Em.$(this).find('input:first').focus();
});
Em.$(document).on('hide', '#createRoom', function() {
	Em.$(this).find('form').trigger('reset');
});
Em.$(document).on('shown', '#user_login', function() {
	Em.$(this).find('input:first').focus();
});
Em.$(document).on('hide', '#user_login', function() {
	Em.$(this).find('form').trigger('reset');
});
Em.$(document).on('shown', '#user_register', function() {
	Em.$(this).find('input:first').focus();
});
Em.$(document).on('hide', '#user_register', function() {
	Em.$(this).find('form').trigger('reset');
});
