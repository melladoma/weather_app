var mongoose = require('mongoose');


var CitySchema = mongoose.Schema({
    name: String,
    icon: String,
    info: String,
    tmin: Number,
    tmax: Number,
});

var CityModel = mongoose.model('cities', CitySchema);

module.exports = CityModel;