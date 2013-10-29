Chat.CreateRoomFormComponent = Em.Component.extend({
	actions: {
		submit: function() {
			$('#createRoom .close').click();	
			this.sendAction('submit', {
				title: this.get('title'),
				description: this.get('description')
			});
		}
	}
});