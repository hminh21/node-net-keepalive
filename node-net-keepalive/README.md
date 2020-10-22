[![NPM][npm_shield]][npm_url]
[![Node][node_shield]][node_url]
[![OS][os_shield]][npm_url]
[![Codecov][codecov_shield]][codecov_url]
[![CI][travis_shield]][travis_url]
[![Dependencies][daviddm_shield]][daviddm_url]
[![Code Quality][codacy_shield]][codacy_url]
[![License][license_shield]][license_url]

[codacy_url]: https://www.codacy.com/app/hertzg/node-net-keepalive
[codacy_shield]: https://api.codacy.com/project/badge/Grade/d191b6408086432586e6c60577485c6f
[npm_url]: https://www.npmjs.com/package/net-keepalive
[npm_shield]: https://img.shields.io/npm/v/net-keepalive.svg?style=flat
[node_url]: https://dist.nodejs.org
[node_shield]: https://img.shields.io/badge/node-%3E%3D4-green.svg
[os_shield]: https://img.shields.io/badge/os-linux%2Cosx%2Cbsd-green.svg
[travis_url]: https://travis-ci.org/hertzg/node-net-keepalive
[travis_shield]: https://travis-ci.org/hertzg/node-net-keepalive.svg?branch=master
[daviddm_url]: https://david-dm.org/hertzg/node-net-keepalive
[daviddm_shield]: https://david-dm.org/hertzg/node-net-keepalive.svg
[license_url]: https://raw.githubusercontent.com/hertzg/node-net-keepalive/master/LICENSE
[license_shield]: https://img.shields.io/badge/license-MIT-blue.svg
[codecov_url]: https://codecov.io/gh/hertzg/node-net-keepalive
[codecov_shield]: https://codecov.io/gh/hertzg/node-net-keepalive/branch/master/graph/badge.svg

# 🔗 net-keepalive

[![NPM](https://nodei.co/npm/net-keepalive.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/net-keepalive/)

The Missing (`TCP_KEEPINTVL` and `TCP_KEEPCNT`) `SO_KEEPALIVE` socket option setters and getters for Node using [`ffi-napi`](https://www.npmjs.com/package/ffi-napi) module.

Tested on 🐧 `linux` & 🍏 `osx` (both `amd64` and `arm64`), should work on 😈 `freebsd` and others. Does not work on 🐄 `win32` (pull requests welcome).

## Install

```bash
npm install --save net-keepalive
```

## Documentation

You can find the [full API Reference Document (JSDoc)](https://hertzg.github.io/node-net-keepalive) published on our github pages.

The project includes TypeScript definitions file (`index.d.ts`) which gives an overview of the API exposed.

Documentation gets generated from JSDoc comments, feel free to improve them by sending pull requests.

## Demo

```javascript
const Net = require('net'),
  NetKeepAlive = require('net-keepalive')
// or
import * as Net from 'net'
import * as NetKeepAlive from 'net-keepalive'

// Create a TCP Server
const srv = Net.createServer((s) => {
  console.log('Connected %j', s.address())
  // Doesn't matter what it does
  s.pipe(s)
})

// Start on some port
srv.listen(1337, () => {
  console.log('Listening on %j', srv.address())
})

// Connect to that server
const s = Net.createConnection({ port: 1337 }, () => {
  console.log('Connected to %j', s.address())

  //IMPORTANT: KeepAlive must be enabled for this to work
  s.setKeepAlive(true, 1000)

  // Set TCP_KEEPINTVL for this specific socket
  NetKeepAlive.setKeepAliveInterval(s, 1000)

  // Get TCP_KEEPINTVL for this specific socket
  NetKeepAlive.getKeepAliveInterval(s) // 1000

  // Set TCP_KEEPCNT for this specific socket
  NetKeepAlive.setKeepAliveProbes(s, 1)

  // Get TCP_KEEPCNT for this specific socket
  NetKeepAlive.getKeepAliveProbes(s) // 1
})
```

Now using `iptables` add rule to drop all `tcp` packets on `INPUT` chain to port `1337`.

```bash
iptables -I INPUT -m tcp -p tcp --dport 1337 -j DROP
```

If you were monitoring packets on `loopback` with `tcp.srcport == 1337 || tcp.dstport == 1337` filter in `wireshark`. You will see the following output:

[![Wireshark screenshot KEEPALIVE](http://hertzg.github.io/node-net-keepalive/images/wireshark.jpg)](http://hertzg.github.io/node-net-keepalive/images/wireshark.jpg)

Have fun!

More info about `SO_KEEPALIVE` here: [TCP Keepalive HOWTO](http://tldp.org/HOWTO/TCP-Keepalive-HOWTO/)
`C` Code examples here: [Examples](http://tldp.org/HOWTO/TCP-Keepalive-HOWTO/programming.html#examples)

## Sample

**_Note: For these methods to work you must enable `SO_KEEPALIVE` and set the `TCP_KEEPIDLE` options for socket using `Net.Socket`-s built in method [`socket.setKeepAlive([enable][, initialDelay])`](https://nodejs.org/api/net.html#net_socket_setkeepalive_enable_initialdelay) !_**

    TCP_KEEPIDLE (since Linux 2.4) The time (in seconds) the connection needs to remain idle before TCP starts sending keepalive probes, if the socket option SO_KEEPALIVE has been set on this socket. This option should not be used in code intended to be portable.

```JavaScript
const NetKeepAlive = require('net-keepalive')
// or
import * as NetKeepAlive from 'net-keepalive'

// .....

const enable = true                                             // enable SO_KEEPALIVE
const initialDuration = 1000                                    // start probing after 1 second of inactivity
socket.setKeepAlive(enable, initialDuration)                    // sets SO_KEEPALIVE and TCP_KEEPIDLE

const probeInterval = 1000                                      // after initialDuration send probes every 1 second
NetKeepAlive.setKeepAliveInterval(socket, probeInterval)        //sets TCP_KEEPINTVL

const maxProbesBeforeFail = 10                                  // after 10 failed probes connection will be dropped
NetKeepAlive.setKeepAliveProbes(socket, maxProbesBeforeFail)    // sets TCP_KEEPCNT

// ....
```

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)