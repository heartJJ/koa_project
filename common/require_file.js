/**
 * 已更新为 read_all_file 包
 */



// 'use strict';

// const {resolve} = require('path'),
//   {readdirSync, statSync} = require('fs');

// const readFile = (option) => {
//   return readdirSync(option).map(val => {
//     const filePath = resolve(option, val);
//     if(statSync(filePath).isDirectory()) {
//       return readFile(filePath);
//     } else if(statSync(filePath).isFile()){
//       return [filePath];
//     }
//   }).reduce((preV, curV) => [...preV, ...curV], []);
// };

// module.exports = readFile;