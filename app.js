'use strict';

const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const { createAdapter } = require('@socket.io/redis-adapter');
const { Cluster } = require('ioredis');

const socketHandle = require('./socket/index');
const logger = require('koa-logger');
const debug = require('debug')('myapp');
app.use(logger());

// socket 适配器
const pubClient = new Cluster([
  {
    host: 'localhost',
    port: 6379,
  },
]);
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

// socket连接
socketHandle(io);

// 统一处理错误、返回数据
const {wrapResult} = require('./common/util');

app.use(async (ctx, next) => {
  try{
    let data = await next();

    if (ctx.path.indexOf('socket') === -1 ) {
      wrapResult(ctx, data);
    } 

  } catch (err) {
    debug(err);
    ctx.body = {
      Code: err.status || -20000,
      Message: err.message || 'server error',
      Reuslt: {}
    };
  }
});

// body 解析
const koaBody = require('koa-body'); 
app.use(koaBody({ multipart: true }));

app.use(async (ctx, next) => {
  ctx.body = ctx.request.body;

  const files = ctx.request.files || {};
  const filePaths = [];
  for (let key in files) {
    const file = files[key];
    // const filePath = path.join(__dirname, 'upload', file.name);
    // const reader = fs.createReadStream(file.path);

    // const writer = fs.createWriteStream(filePath);
    // reader.pipe(writer);
    filePaths.push(file.path);
  }

  if ( filePaths.length > 0 ) ctx.body.filePaths = filePaths;
  return await next();
});


app.use(async (ctx, next) => {
  ctx.io = io; // socket 对象置入 ctx ，便于服务中使用
  return await next();
});

// 加载路由
let router = new Router();
const app_router = require('./router');
app_router(router);
app.use(router.routes());

// 监听端口
server.listen(3001, () => {
  // console.log(process.env.NODE_ENV);
  console.log('listening on *:3001');
});

// todo auth 日志 事务