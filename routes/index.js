var express = require('express');
var router = express.Router();
var request = require('sync-request')
var CityModel = require('./bdd')


/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('login', {});
});

router.get('/update', async function (req, res, next) {
  var cityList = await CityModel.find();
  for (let i = 0; i < cityList.length; i++) {
    var cityResult = request('GET', `https://api.openweathermap.org/data/2.5/weather?q=${cityList[i].name}&appid=74e78cd059bab6c7363618d5ebd7fe59&units=metric&lang=fr`)
    var dataApi = JSON.parse(cityResult.body)
    var cityToUpdate = await CityModel.updateOne(
      { _id: cityList[i]._id },
      {
        icon: `http://openweathermap.org/img/wn/${dataApi.weather[0].icon}@2x.png`,
        info: dataApi.weather[0].description,
        tmin: dataApi.main.temp_min,
        tmax: dataApi.main.temp_max,
      }
    )
  }
  cityList = await CityModel.find();

  res.render('weather', { cityList, error: req.session.error });
});

router.get('/weather', async function (req, res, next) {
  req.session.error = false;
  if (cityList == undefined) {
    cityList = []
  }

  var cityList = await CityModel.find();

  res.render('weather', { cityList, error: req.session.error });
});

router.get('/delete-city', async function (req, res, next) {
  req.session.error = false;

  var citytoDelete = await CityModel.findOne({ name: req.query.name });
  await CityModel.deleteOne({ _id: citytoDelete._id });
  var cityList = await CityModel.find();


  res.render('weather', { cityList, error: req.session.error });
});

router.post('/add-city', async function (req, res, next) {
  //requete API sur ville selon input post 
  //aurait pu etre optimisee en ne lancant que sur les villes non exitantes dans le tableau ou existantes dans l'API
  var cityResult = request('GET', `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=74e78cd059bab6c7363618d5ebd7fe59&units=metric&lang=fr`)
  var dataApi = JSON.parse(cityResult.body)
  var cityList;


  if (dataApi.cod !== "404") {
    req.session.error = false;

    var city = new CityModel({
      name: dataApi.name,
      icon: `http://openweathermap.org/img/wn/${dataApi.weather[0].icon}@2x.png`,
      info: dataApi.weather[0].description,
      tmin: dataApi.main.temp_min,
      tmax: dataApi.main.temp_max,
    })

    var existingCity = await CityModel.findOne({ name: city.name })

    if (existingCity == null) {
      var citySaved = await city.save();
    }
    cityList = await CityModel.find();

  } else {
    cityList = await CityModel.find();
    req.session.error = true;
  }

  res.render('weather', { cityList, error: req.session.error });
});

module.exports = router;
