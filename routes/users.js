var express = require('express');
var router = express.Router();
var UserModel = require('../models/users');

/* GET users listing. */
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
  console.log(existingUser)
  if (existingUser) {
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

module.exports = router;
