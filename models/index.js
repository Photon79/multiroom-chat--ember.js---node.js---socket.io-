module.exports = function(mongoose) {
	var userSchema = new mongoose.Schema({
		name: String,
		login: String,
		pass: String,
		loggedIn: Boolean
	});
	this.User = mongoose.model('User', userSchema);

	var roomSchema = new mongoose.Schema({
		title: String,
		description: String,
		messages: [messageSchema],
		creator: String
	});
	this.Room = mongoose.model('Room', roomSchema);

	var userRoomSchema = new mongoose.Schema({
		user: String,
		room: Array
	});
	this.UserRoom = mongoose.model('UserRoom', userRoomSchema);

	var messageSchema = new mongoose.Schema({
		message: String,
		time: {type: Date, default: Date.now},
		user: String,
		room: String
	});
	this.Message = mongoose.model('Message', messageSchema);
	return this;
}