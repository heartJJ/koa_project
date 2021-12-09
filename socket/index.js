const debug = require('debug')('myapp');
const redis = require('../common/redis_connect');

module.exports = io => {

  // 正常连接
  io.on('connection', socket => {
    socket.emit('news', 'normal connection');

    socket.on('chat message', async msg => {
      debug('message: ' + msg, socket.id);
      
      await redis.set(socket.id, msg);
      socket.emit('chat message', msg);
      socket.broadcast.emit('news', `${socket.id}: ${msg}`);
    });
  });

  // Namespace
  var ep1 = io.of('/example1');
  ep1.on('connection', function(socket) {
    debug('example1 connection');
    socket.emit('news', 'example1 connection');
  });

  
};