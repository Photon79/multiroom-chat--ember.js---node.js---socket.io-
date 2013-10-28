Em.Handlebars.registerBoundHelper('sharp_href', function(id, text) {
	id = Handlebars.Utils.escapeExpression(id);
	text = Handlebars.Utils.escapeExpression(text);
	var result = '<a href="#' + id + '" data-toggle="tab" class="btn">' + text + '</a>';
	return new Handlebars.SafeString(result);
});

