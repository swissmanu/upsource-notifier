const debug = require('debug')('upsource-notifier:FeedEventHandler')
const notifier = require('node-notifier')
const openurl = require('openurl')

class FeedEventHandler {
  constructor (config, connection, avatarCache) {
    this.config = config
    this.connection = connection
    this.avatarCache = avatarCache

    this.handleEvent = (event) => {
      debug(`Handle Event ${JSON.stringify(event, null, 2)}`)

      if (event.discussion) {
        this.processDiscussionEvent(event.discussion)
      } else if (event.participantStateChanged) {
        this.provessParticipantStateChanged(event.participantStateChanged)
      } else {
        debug('Processor for event not implemented')
      }
    }
  }

  start () {
    debug('Start FeedEventHandler')
    this.connection.on('subscribeFeedEvents', this.handleEvent)
    this.connection.rpc.subscribeFeedEvents()
  }

  stop () {
    debug('Stop FeedEventHandler')
    this.connection.removeListener('subscribeFeedEvents', this.handleEvent)
  }

  processDiscussionEvent (discussion) {
    debug(`Process Discussion Event`)

    // the comments array contains the original comment and replies... only
    // interessted into the latest one
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
          title: `${userInfo.name}@UpSource: New Comment`,
          message: comment.text,
          icon: avatarPath,
          sound: true, // Only Notification Center or Windows Toasters
          wait: false, // Wait with callback, until user action is taken against event
          data: { discussion, comment }
        }, function (err, response) {
          if (err) {
            debug(`Error ${JSON.stringify(err, null, 2)}`)
          }
        })

        notifier.on('click', (notifierObject, options) => {
          const review = options.data.discussion.discussionInFile.review.reviewId
          const comment = options.data.comment
          openurl.open(`${this.config.upSourceUrl}/${review.projectId}/review/${review.reviewId}?commentId=${comment.commentId}`)
        })
      })
  }

  provessParticipantStateChanged () {
    debug(`Process Participant State Change`)

    // {
    //   "feedItemId": "1461584611030#repo#37dd0eb2-b33e-43c0-9f43-8be0a30e1f26",
    //   "projectId": "repo",
    //   "participantStateChanged": {
    //     "review": {
    //       "reviewId": {
    //         "projectId": "repo",
    //         "reviewId": "JBU-CR-318"
    //       },
    //       "title": "bug-117",
    //       "participants": [
    //         {
    //           "userId": "b3c52aca-3dd2-4267-aa37-44905cdfa93c",
    //           "role": 1,
    //           "state": 1
    //         },
    //         {
    //           "userId": "197417c6-59d5-4c28-892c-18476d7a08bd",
    //           "role": 2,
    //           "state": 3
    //         }
    //       ],
    //       "state": 1,
    //       "branch": "bug-117"
    //     },
    //     "participant": {
    //       "userId": "197417c6-59d5-4c28-892c-18476d7a08bd",
    //       "role": 2,
    //       "state": 3
    //     },
    //     "oldState": 2,
    //     "newState": 3
    //   },
    //   "date": 1461584611030,
    //   "actorId": "197417c6-59d5-4c28-892c-18476d7a08bd"
    // }
  }

}

module.exports = FeedEventHandler
