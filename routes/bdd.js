var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect('mongodb+srv://admin:adminpwd@cluster0.wsfgl.mongodb.net/weatherapp?retryWrites=true&w=majority',
    options,
    function (err) {
        console.log(err);
    }
);

var CitySchema = mongoose.Schema({
    name: String,
    icon: String,
    info: String,
    tmin: Number,
    tmax: Number,
});

var CityModel = mongoose.model('cities', CitySchema);

module.exports = CityModel;



