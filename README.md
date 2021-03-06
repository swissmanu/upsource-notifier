# upsource-notifier
[![Build Status](https://travis-ci.org/swissmanu/upsource-notifier.svg)](https://travis-ci.org/swissmanu/upsource-notifier) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![npm version](https://badge.fury.io/js/upsource-notifier.svg)](http://badge.fury.io/js/upsource-notifier) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Installation
```bash
npm install upsource-notifier -g
```

## Configuration
Create a configuration file whereever you like and fill it with your proper settings:

```json
{
  "upSourceUrl": "https://upsource",
  "user": "user",
  "password": "password",
  "clientCertificate": "/Users/user/certs/user.p12",
  "token": "foobar"
}
```

### Get `token` for your configuration

1. Log in to your UpSource account
2. Open the `Network` inspector
3. Find a WebSocket and look for an outgoing message
4. Search for `"Authorization": "Bearer:`
5. Copy-Paste the complete value of the authorization property to your configuration as `token`. (The correct token will look like `Bearer: [value]==`)

## Usage
```bash
upsource-notifier -c /path/to/my/config/file.json
```

If your configuration file named `config.json` is in the current working directory, starting `upsource-notifier` is sufficient.

## Debug Traces
`upsource-notifier` uses [debug](https://github.com/visionmedia/debug) for generating traces throughout its execution time. Activate them by setting the `DEBUG` environment variable:

```bash
$ DEBUG=upsource-notifier* upsource-notifier
```

## License

Copyright (c) 2016 Manuel Alabor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
