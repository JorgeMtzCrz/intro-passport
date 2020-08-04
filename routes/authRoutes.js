const {
  Router
} = require('express')
const router = Router()
const passport = require('../middlewares/passport')
const {
  getSignup,
  postSignup,
  getLogin,
  logout
} = require('../controllers/authControllers')

router.get('/signup', getSignup)
router.post('/signup', postSignup)
router.get('/login', getLogin)
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  passReqToCallback: true,
  failureFlash: true
}))

router.get('/logout', logout)
router.get('/slack', passport.authenticate('slack'))
router.get('/slack/callback', passport.authenticate('slack', {
  successRedirect: '/private-page',
  failureRedirect: '/auth/login'
}))

module.exports = router