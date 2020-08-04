const passport = require('passport')
const User = require('../models/User')
const {
  compareSync
} = require('bcrypt')
const localStrategy = require('passport-local').Strategy
const slackStrategy = require('passport-slack').Strategy

passport.serializeUser((user, cb) => {
  //recibe el usuario que se logueo y se apoya del id para manejar la sesion
  //y envía el id al método deserializaUser
  cb(null, user._id)
})

passport.deserializeUser(async (id, cb) => {
  //recibe el id y verifica el usuario contra la BD
  //una vez que recibe el usuario lo guarda en la propiedad user del request
  //req.user
  try {
    const user = await User.findById(id)
    cb(null, user)
  } catch (err) {
    cb(err)
  }
})

passport.use(new localStrategy(async (username, password, next) => {
  try {
    const user = await User.findOne({
      username
    })
    if (!user) {
      return next(null, false, {
        message: 'Incorrect username'
      })
    }
    if (!compareSync(password, user.password)) {
      return next(null, false, {
        message: 'Incorrect password'
      })
    }
    next(null, user) // el usuario se envía a serializeUser
  } catch (error) {
    next(error)
  }
}))

passport.use(new slackStrategy({
  clientID: process.env.SLACK_ID,
  clientSecret: process.env.SLACK_SECRET
}, async (accessToken, refreshToken, profile, done) => {
  try {

    const user = await User.findOne({
      slackID: profile.id
    })
    if (user) {
      return done(null, user)
    }
    const newUser = await User.create({
      username: profile.displayName,
      slackID: profile.id
    })
    done(null, newUser)
  } catch (err) {
    return done(err)
  }
}))

module.exports = passport