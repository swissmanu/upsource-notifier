var fs = require('fs')

class AvatarService {
  constructor (socket) {
    this._socket = socket
  }

  avatarForUserId (userId) {
    return Promise.resolve()
  }
}

module.exports = AvatarService

// emit(socket, {
//   type: 'rpc',
//   method: 'getCurrentUser',
//   data: {}
// }, function(currentUser) {
//   emit(socket, {
//     type: 'rpc',
//     method: 'getUserInfo',
//     data: { ids: currentUser.result.userId }
//   }, function(user) {
//     console.log(JSON.stringify(user, null, 2))
//   })
// })
