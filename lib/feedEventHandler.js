const debug = require('debug')('upsource-notifier:FeedEventHandler')
const notifier = require('node-notifier')
const openurl = require('openurl')

class FeedEventHandler {
  constructor (config, connection, avatarCache) {
    this.config = config
    this.connection = connection
    this.avatarCache = avatarCache

    connection.on('subscribeFeedEvents', (event) => this.handleEvent(event))
    connection.rpc.subscribeFeedEvents()
  }

  handleEvent (event) {
    debug(`Handle Event ${JSON.stringify(event, null, 2)}`)
    // the comments array contains the original comment and replies... only
    // interessted into the latest one
    const discussion = event.discussion
    const comments = discussion.discussionInFile.comments
    const comment = comments[comments.length - 1]

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
          wait: false, // Wait with callback, until user action is taken against event
          data: discussion
        }, function (err, response) {
          if (err) {
            debug(`Error ${JSON.stringify(err, null, 2)}`)
          }
        })

        notifier.on('click', (notifierObject, options) => {
          const review = options.data.discussionInFile.review.reviewId
          openurl.open(`${this.config.upSourceUrl}/${review.projectId}/review/${review.reviewId}`)
        })
      })
  }
}

module.exports = FeedEventHandler
