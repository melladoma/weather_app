var express = require('express');
var router = express.Router();
var request = require('sync-request');
var CityModel = require('../models/cities');


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.session.user)
  res.render('login', {});
});

//GET cities page
router.get('/weather', async function (req, res, next) {

  req.session.error = false;
  console.log(req.session.user)
  if (!req.session.user) {
    res.redirect('/')
  } else {
    var cityList = await CityModel.find();
  }
  res.render('weather', { cityList, error: req.session.error });
});

//GET add city
router.post('/add-city', async function (req, res, next) {
  //requete API sur ville selon input post 
  //aurait pu etre optimisee en ne lancant que sur les villes non exitantes dans le tableau ou existantes dans l'API
  var cityResult = request('GET', `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=74e78cd059bab6c7363618d5ebd7fe59&units=metric&lang=fr`)
  var dataApi = JSON.parse(cityResult.body)

  if (dataApi.cod !== "404") {
    req.session.error = false;

    var city = new CityModel({
      name: dataApi.name,
      icon: `http://openweathermap.org/img/wn/${dataApi.weather[0].icon}@2x.png`,
      info: dataApi.weather[0].description,
      tmin: dataApi.main.temp_min,
      tmax: dataApi.main.temp_max,
      lat: dataApi.coord.lat,
      lon: dataApi.coord.lon,
    })

    var existingCity = await CityModel.findOne({ name: city.name })
    if (existingCity == null) {
      var citySaved = await city.save();
    }
    var cityList = await CityModel.find();

  } else {
    cityList = await CityModel.find();
    req.session.error = true;
  }

  res.render('weather', { cityList, error: req.session.error });
});

//GET delete city
router.get('/delete-city', async function (req, res, next) {
  req.session.error = false;

  await CityModel.deleteOne({ _id: req.query.id });
  var cityList = await CityModel.find();

  res.render('weather', { cityList, error: req.session.error });
});

//GET update cities
router.get('/update', async function (req, res, next) {
  var cityList = await CityModel.find();
  for (let i = 0; i < cityList.length; i++) {
    var cityResult = request('GET', `https://api.openweathermap.org/data/2.5/weather?q=${cityList[i].name}&appid=74e78cd059bab6c7363618d5ebd7fe59&units=metric&lang=fr`)
    var dataApi = JSON.parse(cityResult.body)
    await CityModel.updateOne(
      { _id: cityList[i]._id },
      {
        icon: `http://openweathermap.org/img/wn/${dataApi.weather[0].icon}@2x.png`,
        info: dataApi.weather[0].description,
        tmin: dataApi.main.temp_min,
        tmax: dataApi.main.temp_max,
        lat: dataApi.coord.lat,
        lon: dataApi.coord.lon,
      }
    )
  }
  cityList = await CityModel.find();

  res.render('weather', { cityList, error: req.session.error });
});

router.post('/post-city', async function (req, res, next) {
  var geoResult = request('GET', `http://api.openweathermap.org/geo/1.0/reverse?lat=${req.body.eventLat}&lon=${req.body.eventLng}&limit=1&appid=74e78cd059bab6c7363618d5ebd7fe59`)
  var geoApi = JSON.parse(geoResult.body)

  var cityResult = request('GET', `https://api.openweathermap.org/data/2.5/weather?q=${geoApi[0].name}&appid=74e78cd059bab6c7363618d5ebd7fe59&units=metric&lang=fr`)
  var dataApi = JSON.parse(cityResult.body)

  if (dataApi.cod !== "404") {
    req.session.error = false;

    var city = new CityModel({
      name: dataApi.name,
      icon: `http://openweathermap.org/img/wn/${dataApi.weather[0].icon}@2x.png`,
      info: dataApi.weather[0].description,
      tmin: dataApi.main.temp_min,
      tmax: dataApi.main.temp_max,
      lat: dataApi.coord.lat,
      lon: dataApi.coord.lon,
    })

    var existingCity = await CityModel.findOne({ name: city.name })
    if (existingCity == null) {
      var citySaved = await city.save();
    }
    var cityList = await CityModel.find();

  } else {
    cityList = await CityModel.find();
    req.session.error = true;
  }
  console.log(cityList)
  res.render('weather', { cityList, error: req.session.error });

});

// version get + fetch

// router.get('/get-city', async function (req, res, next) {
//   console.log(req.query)
//   var geoResult = request('GET', `http://api.openweathermap.org/geo/1.0/reverse?lat=${req.query.eventLat}&lon=${req.query.eventLng}&limit=1&appid=74e78cd059bab6c7363618d5ebd7fe59`)
//   var geoApi = JSON.parse(geoResult.body)

//   var cityResult = request('GET', `https://api.openweathermap.org/data/2.5/weather?q=${geoApi[0].name}&appid=74e78cd059bab6c7363618d5ebd7fe59&units=metric&lang=fr`)
//   var dataApi = JSON.parse(cityResult.body)

//   if (dataApi.cod !== "404") {
//     req.session.error = false;

//     var city = new CityModel({
//       name: dataApi.name,
//       icon: `http://openweathermap.org/img/wn/${dataApi.weather[0].icon}@2x.png`,
//       info: dataApi.weather[0].description,
//       tmin: dataApi.main.temp_min,
//       tmax: dataApi.main.temp_max,
//       lat: dataApi.coord.lat,
//       lon: dataApi.coord.lon,
//     })

//     var existingCity = await CityModel.findOne({ name: city.name })
//     if (existingCity == null) {
//       var citySaved = await city.save();
//     }
//     var cityList = await CityModel.find();

//   } else {
//     cityList = await CityModel.find();
//     req.session.error = true;
//   }
//   console.log(cityList)
//   res.render('weather', { cityList, error: req.session.error });
//   // res.send('weather');
// });




module.exports = router;
