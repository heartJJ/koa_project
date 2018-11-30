'use strict';

const Koa = require('koa');
const app = new Koa();

const Router = require('koa-router'); 
const router = new Router();


// 统一处理错误、返回数据
const {wrapResult} = require('./common/util');

app.use(async (ctx, next) => {
  try{
    let data = await next();
    wrapResult(ctx, data);
  } catch (err) {
    console.log(err);
    ctx.body = {
      Code: err.status || -20000,
      Message: err.message || '服务商出错了',
      Reuslt: {}
    };
  }
});

// body 解析
const koaBody = require('koa-body'); 
// const path = require('path');
// const fs = require('fs');
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

  ctx.body.filePaths = filePaths;
  return await next();
});

// 加载路由
const app_router = require('./router');
app.use(router.routes());
app_router(router);


// 未抓取到的错误 
// app.on('err', (err) => {
//   console.log(err);
//   process.exit(-1);
// } );

app.listen(3000);
console.log('[demo] start-quick is starting at port 3000');


// todo auth 日志 事务