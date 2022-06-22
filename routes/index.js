var express = require('express');
var router = express.Router();
var request = require('sync-request')



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login', {});
});

router.get('/weather', function (req, res, next) {
  req.session.error = false;
  if (req.session.cityList == undefined) {
    req.session.cityList = []
  }
  res.render('weather', { cityList: req.session.cityList, error: req.session.error });
});

router.get('/delete-city', function (req, res, next) {
  req.session.error = false;
  req.session.cityList.splice(req.query.index, 1)
  res.render('weather', { cityList: req.session.cityList, error: req.session.error });
});

router.post('/add-city', function (req, res, next) {
  //requete API sur ville selon input post 
  //aurait pu etre optimisee en ne lancant que sur les villes non exitantes dans le tableau ou existantes dans l'API
  var cityResult = request('GET', `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=74e78cd059bab6c7363618d5ebd7fe59&units=metric&lang=fr`)
  var dataApi = JSON.parse(cityResult.body)

  if (dataApi.cod !== "404") {
    req.session.error = false;
    let city = {
      name: dataApi.name,
      image: "/images/map.png",
      icon: `http://openweathermap.org/img/wn/${dataApi.weather[0].icon}@2x.png`,
      info: dataApi.weather[0].description,
      tmin: dataApi.main.temp_min,
      tmax: dataApi.main.temp_max,
    }

    if (typeof req.session.cityList !== "undefined" && req.session.cityList.length > 0) {
      const isExisting = item => item.name.toLowerCase() === city.name.toLowerCase()
      if (!(req.session.cityList.findIndex(isExisting) >= 0)) {
        req.session.cityList.push(city)
      }
    } else {
      req.session.cityList = [city]
    }

  } else {
    req.session.error = true;
  }
  res.render('weather', { cityList: req.session.cityList, error: req.session.error });
});

module.exports = router;
