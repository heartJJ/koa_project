const debug = require('debug')('myapp');
const redis = require('../common/redis_connect');

let num = 0;

module.exports = io => {

  // 正常连接
  io.on('connection', async socket => {
    num++;
    socket.emit('news', `client ${num} normal connection`);

    await redis.set(`client-${num}`, socket.id);
    await redis.set(`socket-${socket.id}`, num);

    socket.on('chat message', msg => {
      debug('message: ' + msg, socket.id);
      
      socket.emit('chat message', msg);
      socket.broadcast.emit('news', `${socket.id}: ${msg}`); // 广播，除了自己
    });
  });

  io.on('disconnect', async socket => {
    const n = await redis.get(`socket-${socket.id}`);
    await redis.del(`socket-${socket.id}`);
    await redis.del(`client-${n}`);
  });

  // Namespace
  var ep1 = io.of('/example1');
  ep1.on('connection', function(socket) {
    debug(`example1 connection: ${socket.id}`);
    socket.emit('news', 'example1 connection');
  });  
};