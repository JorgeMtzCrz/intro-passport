const {
  genSaltSync,
  hashSync
} = require('bcrypt')
const User = require('../models/User')

exports.getSignup = (req, res) => {
  res.render('auth/signup')
}

exports.postSignup = async (req, res) => {
  const {
    username,
    password
  } = req.body
  const salt = genSaltSync(10)
  const hashPassword = hashSync(password, salt)
  const user = await User.findOne({
    username
  })
  if (username === '' || password === '') {
    return res.render('auth/signup', {
      message: 'username of password empty'
    })
  }
  if (user !== null) {
    return res.render('auth/signup', {
      message: 'the username already exists'
    })
  }
  await User.create({
    username,
    password: hashPassword
  })
  res.redirect('/auth/login')
}

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    message: req.flash('error')
  })
}

exports.logout = (req, res) => {
  req.logout()
  res.redirect('/auth/login')
}