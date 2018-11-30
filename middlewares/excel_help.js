/**
 * Excel解析中间件
 * Created by HJJ on 18/11/30.
 */
'use strict';

const XLSX = require('xlsx');

let excel = {};

// 解析
excel.parse = async (ctx, next) => {
  let workSheetArr = XLSX.readFile(ctx.body.filePaths[0], {cellDates: true});
  // let workSheetArr = XLSX.read(ctx.buffer, {cellDates: true});
  ctx.excel_parse = workSheetArr.SheetNames.map(v => {
    return {
      sheetName: v,
      data: XLSX.utils.sheet_to_json(workSheetArr.Sheets[v], {raw: true, defval: ''})
    };
  }); 

  return await next();
};

// 生成
excel.write = async (ctx, next) => {
  let { SheetNames, Sheets, filename} = ctx.excel_write;

  if (SheetNames.length !== Sheets.length) {
    ctx.throw('500');
  }

  let workSheet = { SheetNames, Sheets: {} };

  Sheets.forEach( (v, i) => {
    workSheet.Sheets[SheetNames[i]] = XLSX.utils.json_to_sheet(v);
  });

  let buffer = new Buffer(XLSX.write(workSheet, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  }), 'binary');

  ctx.set({
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename=${encodeURI(filename)}.xlsx`,
    'Content-Length': buffer.size
  });

  return { type: 'buffer', buffer };
};


module.exports = excel;