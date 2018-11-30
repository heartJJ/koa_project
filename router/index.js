const {extname, basename} = require('path'),
  readFile = require('../common/require_file');

module.exports = function(router) {
  readFile(__dirname)
    .filter(val => extname(val) === '.js' && basename(val) !== 'index.js')
    .forEach(file => require(file)(router));
};