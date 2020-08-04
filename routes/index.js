const express = require('express');
const router = express.Router();
const {
  ensureLoggedIn
} = require('connect-ensure-login')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/private-page', ensureLoggedIn({
  redirectTo: '/auth/login'
}), (req, res) => {

  res.render('private', {
    user: req.user
  })
})

module.exports = router;