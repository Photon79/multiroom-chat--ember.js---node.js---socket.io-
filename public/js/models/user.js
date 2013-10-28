Chat.User = Emu.Model.extend({
	_id: Emu.field('string', {primaryKey: true}),
	login: Emu.field('string'),
	name: Emu.field('string'),
	pass: Emu.field('string'),
	loggedIn: Emu.field('boolean')
});