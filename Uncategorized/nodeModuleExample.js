// @ts-nocheck

// 每個 js 檔案都是一個 Module，假設 id 為 *Module
var files = {
  aModule: aModule,
  bModule: bModule,
  cModule: cModule,
  dModule: dModule,
};

var cachedModules = {};
function require(fileName) {
  if (cachedModules[fileName]) {
    return cachedModules[fileName];
  }

  // 分配物件記憶體位置
  var exports = {};
  var module = { exports };

  files[fileName](require, exports, module);
  cachedModules[fileName] = module.exports;
  return module.exports;
}

function aModule(require, exports, module) {
  var randomValue = Math.random(); // 用 random 測試快取機制

  var exports2 = exports; // 指向同一個 reference
  console.log(exports === exports2); // true
  exports2 = { value: randomValue }; // 若 exports2 賦予一個新的物件，就會分配新的記憶體，使得 reference 不同
  console.log(exports === exports2); // false
  console.log('a:', module); // 結果 a: { exports: {} }
}

function bModule(require, exports, module) {
  var randomValue = Math.random();

  exports.value = randomValue;
  console.log('b:', module); // 結果 b: { exports: value: <randomValue> }
}

function cModule(require, exports, module) {
  var valueA = require('aModule').value;
  var valueB = require('bModule').value;

  console.log('c(a):', valueA);
  console.log('c(b):', valueB);
}

// 測試其中一個 Module 修改傳入的引數 module
function dModule(require, exports, module) {
  require('cModule');
  var b = require('bModule');
  console.log('d(original B):', b);
  b.value = 'overwrite';
  console.log('d(overwritten B):', b.value);
}

require('dModule');
