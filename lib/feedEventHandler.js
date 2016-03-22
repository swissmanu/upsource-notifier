const debug = require('debug')('upsource-notifier:FeedEventHandler')
const notifier = require('node-notifier')

class FeedEventHandler {
  constructor (connection, avatarCache) {
    this.connection = connection
    this.avatarCache = avatarCache

    connection.on('subscribeFeedEvents', (event) => this.handleEvent(event))
    connection.rpc.subscribeFeedEvents()
  }

  handleEvent (event) {
    debug(`Handle Event ${JSON.stringify(event, null, 2)}`)

    event.discussion.discussionInFile.comments.forEach((comment) => {
      Promise.all([
        this.avatarCache.avatarForUserId(comment.authorId),
        this.connection.rpc.getUserInfo(comment.authorId)
      ])
        .then((results) => {
          const avatarPath = results[0]
          const userInfo = results[1]

          notifier.notify({
            title: `${userInfo.name}: New UpSource Comment)`,
            message: comment.text,
            icon: avatarPath,
            sound: true, // Only Notification Center or Windows Toasters
            wait: false // Wait with callback, until user action is taken against event
          }, function (err, response) {
            if (err) {
              debug(`Error ${JSON.stringify(err, null, 2)}`)
            }
          })
        })
    }, this)
  }
}

module.exports = FeedEventHandler
