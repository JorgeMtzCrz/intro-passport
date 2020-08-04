const {
  model,
  Schema
} = require('mongoose')

const UserSchema = new Schema({
  username: String,
  password: String,
  slackID: String
}, {
  timestamps: {
    createdAt: 'createdAt',
    updateAt: 'updateAt'
  },
  versionKey: false
})

module.exports = model('User', UserSchema)