const debug = require('debug')('upsource-notifier:AvatarCache')
const fs = require('fs')
const ensureDir = require('fs-extra').ensureDirSync
const join = require('path').join

class AvatarCache {
  constructor (connection) {
    this.connection = connection
    ensureDir(this.pathForCache())
  }

  avatarForUserId (userId) {
    debug(`Get avatar for user ${userId}`)
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
    debug(`Get avatar path for user ${userId}`)
    return join(this.pathForCache(), userId)
  }

  pathForCache () {
    debug(`Get cache path`)
    return join(process.cwd(), '.cache', 'avatars')
  }

  fetchAvatar (userId) {
    debug(`Fetch avatar from API for user ${userId}`)
    const self = this
    return self.connection.rpc.getUserInfo(userId)
      .then((userInfo) => {
        return self.connection.download(userInfo.avatarUrl, () => fs.createWriteStream(self.avatarPathForUserId(userId)))
      })
  }
}

module.exports = AvatarCache
