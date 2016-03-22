const notifier = require('node-notifier')

class FeedEventHandler {
  constructor (connection, avatarCache) {
    this.avatarCache = avatarCache
    connection.on('notification', (notification) => this.handleNotification(notification))
    connection.rpc.subscribeFeedEvents()
  }

  handleNotification (notification) {
    if (notification.name === 'subscribeFeedEvents') {
      const { data } = notification

      notifier.notify({
        title: 'UpSource',
        message: JSON.stringify(data),
        // icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
        sound: true, // Only Notification Center or Windows Toasters
        wait: false // Wait with callback, until user action is taken against notification
      }, function (err, response) {
        // Response is response from notification
        if (err) {
          console.log(err)
        }
      })
    }
  }
}

module.exports = FeedEventHandler
