'use strict';

const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const logger = require('koa-logger');

const socketHandle = require('./socket/index');
const debug = require('debug')('myapp');

app.use(logger());

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

// 加载路由
let router = new Router();
const app_router = require('./router');
app_router(router);
app.use(router.routes());

// socket连接
socketHandle(io);

// 监听端口
server.listen(3001, () => {
  debug('listening on *:3001');
});

// todo auth 日志 事务