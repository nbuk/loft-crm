const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const User = require('../db').models.user;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = jwtSecretKey;

const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
    console.log('payload received', jwt_payload);
    const user = await User.findOne({ where: { id: jwt_payload.id } });
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

passport.use(strategy);

module.exports = passport;