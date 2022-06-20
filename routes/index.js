var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('login', {});
});

router.get('/weather', function (req, res, next) {
  if (req.session.cityList == undefined) {
    req.session.cityList = []
  }
  res.render('weather', { cityList: req.session.cityList });
});

router.get('/delete-city', function (req, res, next) {
  req.session.cityList.splice(req.query.index, 1)
  res.render('weather', { cityList: req.session.cityList });
});

router.post('/add-city', function (req, res, next) {
  let city = {
    name: req.body.city,
    image: "/images/map.png",
    icon: "fa-solid fa-cloud-rain",
    info: "pluie",
    tmin: 3.89,
    tmax: 6,
  }

  if (typeof req.session.cityList !== "undefined" && req.session.cityList.length > 0) {
    const isExisting = item => item.name === city.name
    if (!(req.session.cityList.findIndex(isExisting) >= 0)) {
      req.session.cityList.push(city)
    }
  } else {
    req.session.cityList = [city]
  }
  res.render('weather', { cityList: req.session.cityList });
});

module.exports = router;
