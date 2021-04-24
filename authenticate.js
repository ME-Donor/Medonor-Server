var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt=require('passport-jwt').ExtractJwt;
var jwt=require('jsonwebtoken');//used to create,sign, and verify tokens
//var FacebookTokenStrategy=require('passport-facebook-token');

var config=require('./config.js');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken=function(user) {
    return jwt.sign(user,config.secretKey,
        {expiresIn:36000});
};

var opts = {};
opts.jwtFromRequest= ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey=config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload,done)=>{
    console.log('JWT payload: ',jwt_payload);
    User.findOne({_id: jwt_payload._id},(err,user)=>{
        if(err){
            return done(err,false);
        }
        else if (user){
            return done(null,user);
        }
        else{
            return done(null,false);
        }
    });
}));


exports.verifyUser=passport.authenticate('jwt',{session:false});


exports.roleAuthorization = function(roles){

    return function(req, res, next){

        var user = req.user;

        User.findById(user._id, function(err, foundUser){

            if(err){
                res.status(422).json({error: 'No user found.'});
                return next(err);
            }

            if(roles.indexOf(foundUser.role) > -1){
                return next();
            }

            res.status(401).json({error: 'You are not authorized to view this content'});
            return next('Unauthorized');

        });

    }

}

