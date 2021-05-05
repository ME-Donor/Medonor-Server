var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var router = express.Router();
var authenticate = require('../authenticate');
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verifyUser,authenticate.roleAuthorization(['admin']), (req, res, next) => {
  User.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
    });
});

/* Get Ngo listing. */



router.post('/signup', (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      } else {
        if (req.body.name) user.name = req.body.name;
        if (req.body.description) user.description = req.body.description;
        if(req.body.role) user.role=req.body.role;
        if (req.body.address) user.address = req.body.address;
        if(req.body.contact) user.contact = req.body.contact;
        user.save((err, user) => {
          passport.authenticate('local')(req, res, () => {
            if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({ err: err });
              return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
          });
        });
      }
    }
  );
});
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success: true,
    token: token,
    user: req.user,
    status: 'You are successfully logged in!',
  });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
