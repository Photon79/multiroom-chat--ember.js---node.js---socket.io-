window.Chat = Em.Application.create({
	title: "Simple chat with multiroom support",
	Socket: ES.Module.extend({
		host: 'localhost',
		port: 3000,
		controllers: ['chat']
	})
});

Chat.Store = Emu.Store.extend({
	revision: 1,
	adapter: Emu.RestAdapter.extend({
		url: "http://localhost:3000",
		namespace: 'api',
		bulkCommit: false
	})
});

$(document).on('tab.shown', 'a[data-toggle="tab"]', function (e) {
	$(e.target).parent().addClass('btn-primary');
  	$(e.relatedTarget).parent().removeClass('btn-primary');
});