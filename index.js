// curl -X POST -u mal: --cert "Manuel Alabor" -H "Content-Type: application/json" -d '{"limit": 1, "project": "jaso-backoffice-ui", "type": 1}' https://review.scaling.ch/~rpc/getFeed
// https://review.scaling.ch/~api_doc/reference/Projects.html#messages.FeedRequestDTO

const debug = require('debug')('upsource-notifier')
const config = require('./config.json')
const Connection = require('./lib/connection')
const FeedEventHandler = require('./lib/feedEventHandler')
const AvatarCache = require('./lib/avatarCache')

const connection = new Connection(config)
connection.connect()
  .then((connection) => {
    debug('Connected')
    const avatarCache = new AvatarCache(connection)
    new FeedEventHandler(config, connection, avatarCache)
  })
  .catch((err) => debug(`Error ${JSON.stringify(err, null, 2)}`))
