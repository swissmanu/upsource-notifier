const debug = require('debug')('upsource-notifier:Connection')
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
    debug('Connect')
    const self = this

    return new Promise((resolve, reject) => {
      self.socket = io.connect(self.config.upSourceUrl, {
        path: '/~socket.io',
        secure: true,
        agent: https.globalAgent
      })

      self.socket.on('connect', () => {
        debug('Connected')
        self.socket.on('message', self.handleMessage.bind(self))
        resolve(self)
      })
      self.socket.on('connect_error', (err) => {
        debug('Error during connect')
        reject(err)
      })
    })
  }

  handleMessage (raw) {
    debug(`Handle message ${raw}`)
    const data = JSON.parse(raw)

    if (data.event === 'RpcResult') {
      debug('Got RPC result')
      const requestId = data['X-Request-ID']
      this.pendingRpcResponses[requestId].resolve(data.data)
      delete this.pendingRpcResponses[requestId]
    } else if (data.event === 'Notification') {
      debug('Got Notification. Emit it via EventEmitter')
      this.emit(data.name, data.data)  // name is something like subscribeFeedEvents etc
    }
  }

  rpcCall (remoteProcedureName, data = {}) {
    debug(`Do RPC Call ${remoteProcedureName} with ${JSON.stringify(data, null, 2)}`)
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
    debug(`Do RPC Call ${remoteProcedureName} without expecting response with ${JSON.stringify(data, null, 2)}`)
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
    debug(`Download ${url}`)
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
    debug(`Subscribe feed events of ${projectId}`)
    this.connection.rpcCallWithoutResponse('subscribeFeedEvents', { projectId })
  }

  getCurrentUser () {
    debug(`Get current user`)
    return this.connection.rpcCall('getCurrentUser')
      .then((data) => data.result)
  }

  getUserInfo (userId) {
    debug(`Get user info for ${userId}`)
    return this.getMultipleUserInfo(userId)
  }

  getMultipleUserInfo (...userIds) {
    debug(`Get multiple user info for ${userIds}`)
    return this.connection.rpcCall('getUserInfo', { ids: userIds })
      .then((data) => data.result.infos[0])
  }
}

module.exports = Connection
