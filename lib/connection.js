const fs = require('fs')
const io = require('socket.io-client')
const https = require('https')
const request = require('request')
const EventEmitter = require('events').EventEmitter

class Connection extends EventEmitter {
  constructor (config) {
    super()
    this.config = config

    this.nextRpcCallId = 1
    this.pendingRpcResponses = {}
    this.rpc = new RPC(this)  // compose :)

    const clientCertificate = fs.readFileSync(config.clientCertificate)
    https.globalAgent.options.pfx = clientCertificate
  }

  connect () {
    const self = this
    return new Promise((resolve, reject) => {
      self.socket = io.connect(self.config.upSourceUrl, {
        path: '/~socket.io',
        secure: true,
        agent: https.globalAgent
      })

      self.socket.on('connect', () => {
        self.socket.on('message', self.handleMessage.bind(self))
        resolve(self)
      })
      self.socket.on('connect_error', (err) => {
        reject(err)
      })
    })
  }

  handleMessage (raw) {
    const data = JSON.parse(raw)

    if (data.event === 'RpcResult') {
      const requestId = data['X-Request-ID']
      this.pendingRpcResponses[requestId].resolve(data.data)
      delete this.pendingRpcResponses[requestId]
    } else if (data.event === 'Notification') {
      this.emit('notification', data.data)
    }
  }

  rpcCall (remoteProcedureName, data = {}) {
    const self = this
    const requestId = this.nextRpcCallId++

    return new Promise((resolve, reject) => {
      self.pendingRpcResponses[requestId] = {
        resolve: resolve,
        reject: reject,
        created: new Date()
      }

      self.socket.emit('message', JSON.stringify({
        type: 'rpc',
        method: remoteProcedureName,
        'X-Request-ID': requestId,
        Authorization: self.config.token,
        data: Object.assign({}, data)
      }))
    })
  }

  rpcCallWithoutResponse (remoteProcedureName, data = {}) {
    const requestId = this.nextRpcCallId++

    this.socket.emit('message', JSON.stringify({
      type: 'event',
      method: remoteProcedureName,
      'X-Request-ID': requestId,
      Authorization: this.config.token,
      data: Object.assign({}, data)
    }))
    return Promise.resolve()
  }

  download (url, createTargetPipe) {
    return new Promise((resolve, reject) => {
      request.get(url)
        .on('error', reject)
        .on('response', () => resolve())
        .pipe(createTargetPipe())
    })
  }
}

class RPC {
  constructor (connection) {
    this.connection = connection
  }

  subscribeFeedEvents (projectId) {
    this.connection.rpcCallWithoutResponse('subscribeFeedEvents', { projectId })
  }

  getCurrentUser () {
    return this.connection.rpcCall('getCurrentUser')
      .then((data) => data.result)
  }

  getUserInfo (userId) {
    return this.getMultipleUserInfo(userId)
  }

  getMultipleUserInfo (...userIds) {
    return this.connection.rpcCall('getUserInfo', { ids: userIds })
      .then((data) => data.result.infos[0])
  }
}

module.exports = Connection
