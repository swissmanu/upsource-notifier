const debug = require('debug')('upsource-notifier')
const Connection = require('./lib/connection')
const FeedEventHandler = require('./lib/feedEventHandler')
const AvatarCache = require('./lib/avatarCache')

module.exports = function (config) {
  const connection = new Connection(config)
  connection.connect()
    .then((connection) => {
      debug('Connected')
      const avatarCache = new AvatarCache(connection)
      const feedEventHandler = new FeedEventHandler(config, connection, avatarCache)
      feedEventHandler.start()
    })
    .catch((err) => debug(`Error ${JSON.stringify(err, null, 2)}`))
}
