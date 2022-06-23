var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

var user = 'admin';
var password = 'adminpwd';
var bddname = 'weatherapp';

mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.wsfgl.mongodb.net/${bddname}?retryWrites=true&w=majority`,
    options,
    function (err) {
        console.log(err);
    }
);