const debug = require('debug')('myapp');

module.exports = io => {

  // 正常连接
  io.on('connection', socket => {
    socket.emit('news', 'normal connection');

    socket.on('chat message', (msg) => {
      debug('message: '+ msg);
      socket.emit('chat message', msg);
    });
  });

  // Namespace
  var ep1 = io.of('/example1');
  ep1.on('connection', function(socket) {
    debug('example1 connection');
    socket.emit('news', 'example1 connection');
  });

  
};