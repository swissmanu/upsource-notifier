// curl -X POST -u mal: --cert "Manuel Alabor" -H "Content-Type: application/json" -d '{"limit": 1, "project": "jaso-backoffice-ui", "type": 1}' https://review.scaling.ch/~rpc/getFeed
// https://review.scaling.ch/~api_doc/reference/Projects.html#messages.FeedRequestDTO

const notifier = require('node-notifier');
const path = require('path')

const config = require('./config.json')
const Connection = require('./lib/connection')
const AvatarService = require('./lib/avatarService')

const connection = new Connection(config)
connection.connect()
  .then((connection) => {
    return connection.rpc.getCurrentUser()
  })
  .then((currentUser) => {
    return connection.rpc.getUserInfo(currentUser.userId)
  })
  .then((userInfo) => {
    console.log(userInfo)
  })

// var clientCertificate = fs.readFileSync(config.clientCertificate)
// https.globalAgent.options.pfx = clientCertificate
//
// var socket = io.connect(config.upSourceUrl, {
//   path: '/~socket.io',
//   secure: true,
//   agent: https.globalAgent
// })
//
// var pendingRequests = {};
// var nextRequestId = 1;
// function emit(socket, data, callback) {
//   var requestId = nextRequestId++
//   data.Authorization = config.token
//   data['X-Request-ID'] = requestId
//
//   if (callback) { pendingRequests[requestId] = { callback } }
//   socket.emit('message', JSON.stringify(data))
// }
//
// function handleMessage(raw) {
//   var data = JSON.parse(raw)
//   // console.log('Notification', JSON.stringify(data, null, 2))
//   // console.log(data.event)
//
//   if (data.event === 'RpcResult') {
//     const requestId = data['X-Request-ID']
//     pendingRequests[requestId].callback(data.data)
//     pendingRequests[requestId] = undefined
//   } else if (data.event === 'Notification' && data.name === 'subscribeFeedEvents') {
//     // data.data.discussion
//     //  projectId, commentId
//     // data.data.review
//     //  reviewId
//     // "review\":{\"reviewId\":{\"projectId\":\"jaso-backoffice-ui\",\"reviewId\":\"JBU-CR-263\"},\"title\":\"task-2243\"
//
//     notifier.notify({
//       title: 'UpSource',
//       message: JSON.stringify(data),
//       // icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
//       sound: true, // Only Notification Center or Windows Toasters
//       wait: false // Wait with callback, until user action is taken against notification
//     }, function (err, response) {
//       // Response is response from notification
//     })
//
//   }
// }
//
//
// socket.on('connect', function() {
//   console.log('Connected')
//
//   socket.on('message', handleMessage)
//
//   emit(socket, {
//     type: 'event',
//     method: 'subscribeFeedEvents',
//     data: {
//       projectId: 'jaso-backoffice-ui'
//     },
//   })
//
//   emit(socket, {
//     type: 'rpc',
//     method: 'getCurrentUser',
//     data: {}
//   }, function(currentUser) {
//     emit(socket, {
//       type: 'rpc',
//       method: 'getUserInfo',
//       data: { ids: currentUser.result.userId }
//     }, function(user) {
//       console.log(JSON.stringify(user, null, 2))
//     })
//   })
//
//   // emit(socket, {
//   //   type: 'rpc',
//   //   method: 'getReviewDetails',
//   //   data: {
//   //     projectId: 'jaso-backoffice-ui',
//   //     reviewId: 'JBU-CR-266'
//   //   },
//   // }, function(review) {
//   //   console.log(review)
//   // })
// })
// socket.on('connect_error', function(err) {
//   console.error('Error', JSON.stringify(err))
// })

// notifier.notify({
//   title: 'My awesome title',
//   message: 'Hello from node, Mr. User!',
//   // icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
//   sound: true, // Only Notification Center or Windows Toasters
//   wait: true // Wait with callback, until user action is taken against notification
// }, function (err, response) {
//   // Response is response from notification
// })
//
// notifier.on('click', function (notifierObject, options) {
//   // Triggers if `wait: true` and user clicks notification
// })
//
// notifier.on('timeout', function (notifierObject, options) {
//   // Triggers if `wait: true` and notification closes
// })
