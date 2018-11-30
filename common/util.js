/**
 * Copyright 2018 by FirstGrid
 * Created by HJJ on 18/11/30.
 */
'use strict';

const _ = require('lodash');


let util = {};


util.wrapResult = (ctx, data) => {
  data = _.isNil(data) ?  {} : data;

  ctx.body = data.type === 'buffer' ? 
    data.buffer :
    { Code: 0, Message: '操作成功', Result: data };
};


module.exports = util;