Chat.Room = Emu.Model.extend({
	_id: Emu.field('string', {primaryKey: true}),
	title: Emu.field('string'),
	message: Emu.field("Chat.Message", {collection: true}),
	description: Emu.field('string', {defaultValue: 'Simple chat room'}),
	creator: Emu.field('string')
});

Chat.Message = Emu.Model.extend({
	_id: Emu.field('string', {primaryKey: true}),
	room: Emu.field("Chat.Room"),
	user: Emu.field("Chat.User"),
	text: Emu.field('string'),
	time: Emu.field('date')
});