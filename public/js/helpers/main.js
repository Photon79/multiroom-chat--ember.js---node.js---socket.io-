Em.Handlebars.registerBoundHelper('sharp_href', function(id, text) {
	id = Handlebars.Utils.escapeExpression(id);
	text = Handlebars.Utils.escapeExpression(text);
	var result = '<a href="#' + id + '" data-toggle="tab">' + text + '</a>';
	return new Handlebars.SafeString(result);
});
Em.Handlebars.registerBoundHelper('room_delete_btn', function(room, user) {
	var result = '';
	if (room._attributes) {
		var creator_id = room.get('creator');
	}
	else {
		var creator_id = room.creator;
	}
	if (creator_id == user._attributes['_id']) {
		result = '<button type="button" class="close left" title="Delete room">&times;</button>';
	}
	return new Handlebars.SafeString(result);
});

