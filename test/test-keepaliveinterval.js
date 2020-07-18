// Generated by CoffeeScript 1.10.0
;(function () {
  var Lib, Net, Should, Stream, OS

  Should = require('should')

  Stream = require('stream')

  OS = require('os')

  Net = require('net')

  Lib = require('../lib')

  describe('keep-alive interval', function () {
    it('should be a function', function () {
      return Lib.setKeepAliveInterval.should.be.type('function')
    })
    it('should require two arguments', function () {
      var errorMessage
      errorMessage = 'setKeepAliveInterval requires two arguments'
      ;(function () {
        return Lib.setKeepAliveInterval()
      }.should['throw'](errorMessage))
      ;(function () {
        return Lib.setKeepAliveInterval('')
      }.should['throw'](errorMessage))
      return function () {
        return Lib.setKeepAliveInterval('', '', '')
      }.should['throw'](errorMessage)
    })
    it('should require first argument to be an instance of net.Socket', function () {
      var errorMessage
      errorMessage =
        'setKeepAliveInterval expects an instance of socket as its first argument'
      ;(function () {
        var socket
        socket = null
        return Lib.setKeepAliveInterval(socket, 1)
      }.should['throw'](errorMessage))
      ;(function () {
        var socket
        socket = {}
        return Lib.setKeepAliveInterval(socket, 1)
      }.should['throw'](errorMessage))
      ;(function () {
        var socket
        socket = new (function () {})()
        return Lib.setKeepAliveInterval(socket, 1)
      }.should['throw'](errorMessage))
      return function () {
        var socket
        socket = new Stream.PassThrough()
        return Lib.setKeepAliveInterval(socket, 1)
      }.should['throw'](errorMessage)
    })
    it('should require second argument to be a number', function () {
      var errorMessage, socket
      errorMessage = 'setKeepAliveInterval requires msec to be a Number'
      socket = new Net.Socket()
      ;(function () {
        return Lib.setKeepAliveInterval(socket, null)
      }.should['throw'](errorMessage))
      ;(function () {
        return Lib.setKeepAliveInterval(socket, '')
      }.should['throw'](errorMessage))
      ;(function () {
        return Lib.setKeepAliveInterval(socket, true)
      }.should['throw'](errorMessage))
      return function () {
        return Lib.setKeepAliveInterval(socket, {})
      }.should['throw'](errorMessage)
    })
    it('should throw when fd is missing', function () {
      var errorMessage, socket
      errorMessage = 'Unable to get socket fd'
      socket = new Net.Socket()
      return function () {
        return Lib.setKeepAliveInterval(socket, 1)
      }.should['throw'](errorMessage)
    })
    ;(['darwin', 'freebsd'].indexOf(OS.platform()) !== -1 ? it.skip : it)(
      'should throw when setsockopt returns -1',
      function (done) {
        var errorMessage, socket
        errorMessage = /^setsockopt /i
        socket = null
        return Net.createServer().listen(0, function () {
          var addr, self
          addr = this.address()
          self = this
          return (socket = Net.createConnection(addr, function () {
            ;(function () {
              return Lib.setKeepAliveInterval(socket, -1)
            }.should['throw'](errorMessage))
            socket.destroy()
            self.close()
            return done()
          }))
        })
      }
    )

    it('should be able to set 1 second delay', function (done) {
      var socket
      socket = null
      return Net.createServer().listen(0, function () {
        var addr, self
        addr = this.address()
        self = this
        return (socket = Net.createConnection(addr, function () {
          ;(function () {
            return Lib.setKeepAliveInterval(socket, 1000)
          }.should.not['throw']())
          socket.destroy()
          self.close()
          return done()
        }))
      })
    })

    it('should be able to set and get 4 second delay', function (done) {
      var socket
      socket = null
      return Net.createServer().listen(0, function () {
        var addr,
          self,
          intvl = 4000,
          readValue = null
        addr = this.address()
        self = this
        return (socket = Net.createConnection(addr, function () {
          ;(function () {
            return Lib.setKeepAliveInterval(socket, intvl)
          }.should.not['throw']())
          ;(function () {
            readValue = Lib.getKeepAliveInterval(socket)
          }.should.not['throw']())

          readValue.should.eql(intvl)

          socket.destroy()
          self.close()
          return done()
        }))
      })
    })

    it('should throw when trying to get using invalid fd', function (done) {
      var socket
      socket = null
      return Net.createServer().listen(0, function () {
        var addr, self
        addr = this.address()
        self = this
        return (socket = Net.createConnection(addr, function () {
          var oldHandle = socket._handle
          socket._handle = { fd: -99999 }
          ;(function () {
            Lib.getKeepAliveInterval(socket)
          }.should['throw']('getsockopt EBADF'))

          socket._handle = oldHandle

          socket.destroy()
          self.close()
          return done()
        }))
      })
    })
  })
}.call(this))
