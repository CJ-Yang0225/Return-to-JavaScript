var scope = "global";

function checkScope() {
  var scope = "local-01";
  return function () {
    console.log(scope);
  };
}

checkScope()();

function checkScope2() {
  var scope = "local-02";
  return (function () {
    console.log(scope);
  })();
}

checkScope2();

/* ----------------------------------------------- */

var value = 'global';

function func() {
  var value = 'local';

  return (new Function('console.log(value)'))() // 相較 eval 安全，因為 eval 可以控制函式 scope 內部
}

func()