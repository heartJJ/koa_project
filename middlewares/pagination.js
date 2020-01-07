/**
 * 分页中间件
 * Created by HJJ on 18/11/30.
 */
'use strict';
const _ = require('lodash');

//将Page,PageSize转换成{offset, limit}的对象放在req.pagination
module.exports = async (ctx, next) => {
  let {Page = 1, PageSize = 20} = ctx.query;
  //fixed代码覆盖率插件bug
  Page = Page||1;
  PageSize = PageSize||20;
  //PageSize = PageSize>100?100:PageSize;
  PageSize = PageSize<1?1:PageSize;

  let sortBy = _.get( ctx.query,'SortBy','CJSJ').trim().toUpperCase();
  let sortOrder = _.get( ctx.query,'SortOrder','DESC').trim().toUpperCase();
  sortBy = (sortBy==='DEFAULT' || sortBy==='')?'CJSJ':sortBy;

  ctx.pagination = {
    offset: (Page - 1) * PageSize,
    limit: parseInt(PageSize),
    order: [[sortBy,sortOrder]],
    orderBy: ()=> {
      let {SortBy, SortOrder='DESC'} = ctx.query;
      if (!SortBy || SortBy.toLowerCase() === 'default' || SortBy.trim() === '') {
        return ['CJSJ'];
      }
      SortOrder = 'ASC'===SortOrder.toUpperCase() ? SortOrder : 'DESC';
      return [SortBy.trim(),SortOrder.trim()];
    }
  };
  return await next();
};
