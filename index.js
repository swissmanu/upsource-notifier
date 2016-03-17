var request = require('request')
var path = require('path')
var fs = require('fs')
var config = require('./config.json')

// curl -X POST -u mal: --cert "Manuel Alabor" -H "Content-Type: application/json" -d '{"limit": 1, "project": "jaso-backoffice-ui", "type": 1}' https://review.scaling.ch/~rpc/getFeed
// https://review.scaling.ch/~api_doc/reference/Projects.html#messages.FeedRequestDTO

var FeedTypeEnum = {
  Feed: 1,
  Review: 2
}
var clientCertificate = fs.readFileSync(config.clientCertificate)

request({
  method: 'POST',
  url: 'https://review.scaling.ch/~rpc/getFeed',
  json: true,
  body: {
    limit: 1,
    project: 'jaso-backoffice-ui',
    type: FeedTypeEnum.Feed
  },
  auth: {
    user: config.user,
    pass: config.password
  },
  agentOptions: {
    pfx: clientCertificate
  }

}, function(err, res, body) {
  console.log(JSON.stringify(body, null, 2))
})
