const fs = require('fs')
const ensureDir = require('fs-extra').ensureDirSync
const join = require('path').join

class AvatarService {
  constructor (connection) {
    this.connection = connection
    ensureDir(this.pathForCache())
  }

  avatarForUserId (userId) {
    const self = this
    const avatarPath = this.avatarPathForUserId(userId)

    return new Promise((resolve, reject) => {
      fs.stat(avatarPath, (err) => {
        if (err && err.code === 'ENOENT') {
          resolve(self.fetchAvatar(userId))
        } else {
          resolve(avatarPath)
        }
      })
    })
  }

  avatarPathForUserId (userId) {
    return join(this.pathForCache(), userId)
  }

  pathForCache () {
    return join(process.cwd(), '.cache', 'avatars')
  }

  fetchAvatar (userId) {
    const self = this
    return self.connection.rpc.getUserInfo(userId)
      .then((userInfo) => {
        return self.connection.download(userInfo.avatarUrl, () => fs.createWriteStream(self.avatarPathForUserId(userId)))
      })
      .then(() => {
        console.log('done')
      })
  }
}

module.exports = AvatarService
