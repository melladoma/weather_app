var express = require('express');
var router = express.Router();
var request = require('sync-request');
var CityModel = require('../models/cities');
var UserModel = require('../models/users');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login', {});
});

//POST sign-up
router.post('/sign-up', async function (req, res, next) {

  var newUser = new UserModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  var existingUser = await UserModel.findOne({ email: newUser.email })
  if (!existingUser) {
    //instead of (existingUser === null)
    var userSaved = await newUser.save();
    req.session.user = {
      username: userSaved.username,
      userId: userSaved._id.toString(),
    }
    console.log(req.session.user)

    res.redirect('/weather');
  } else {
    res.redirect('/')
  }

});

//POST sign-in
router.post('/sign-in', async function (req, res, next) {
  var existingUser = await UserModel.findOne({ email: req.body.email, password: req.body.password })
  if (existingUser !== null) {

    req.session.user = {
      username: existingUser.username,
      userId: existingUser._id.toString(),
    }

    res.redirect('/weather');
  } else {
    res.redirect('/')
  }
});

router.get('/logout', function (req, res, next) {
  req.session.user = null;
  console.log(req.session.user)

  res.redirect('/')
});

//GET cities page
router.get('/weather', async function (req, res, next) {
  req.session.error = false;
  if (req.session.user === null) {
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
      }
    )
  }
  cityList = await CityModel.find();

  res.render('weather', { cityList, error: req.session.error });
});

module.exports = router;
