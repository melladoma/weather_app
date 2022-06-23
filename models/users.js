var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

var UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;