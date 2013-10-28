Chat.LoginFormComponent = Em.Component.extend({
	actions: {
		submit: function() {
			$('#user_login .close').click();
			this.sendAction('submit', {
				login: this.get('login'),
				pass: this.get('pass')
			});
		}
	}
});
Chat.RegisterFormComponent = Em.Component.extend({
	actions: {
		submit: function() {
			$('#user_register .close').click();	
			this.sendAction('submit', {
				name: this.get('name'),
				login: this.get('login'),
				pass: this.get('pass'),
				pass2: this.get('pass2')
			});
		}
	}
});