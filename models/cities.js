var mongoose = require('mongoose');


var CitySchema = mongoose.Schema({
    name: String,
    icon: String,
    info: String,
    tmin: Number,
    tmax: Number,
    lat: Number,
    lon: Number,
});

var CityModel = mongoose.model('cities', CitySchema);

module.exports = CityModel;