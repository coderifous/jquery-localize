(function(global) {
  var originalModule, originalTest, setupFn, teardownFn;
  setupFn = function() {
    return null;
  };
  teardownFn = function() {
    return null;
  };
  global.setup = function(fn) {
    return setupFn = fn;
  };
  global.teardown = function(fn) {
    return teardownFn = fn;
  };
  global.moreSetup = function(fn) {
    var origSetup;
    origSetup = setupFn;
    return setup(function() {
      origSetup.call(this);
      return fn.call(this);
    });
  };
  global.moreTeardown = function(fn) {
    var origTeardown;
    origTeardown = teardownFn;
    return teardown(function() {
      fn.call(this);
      return origTeardown.call(this);
    });
  };
  global.clearSetup = function() {
    setup(function() {
      return null;
    });
    return teardown(function() {
      return null;
    });
  };
  originalModule = global.module;
  global.module = function(description) {
    clearSetup();
    return originalModule(description);
  };
  originalTest = global.test;
  return global.test = function(description, testFn) {
    var setupSnapshot, teardownSnapshot;
    setupSnapshot = setupFn;
    teardownSnapshot = teardownFn;
    return originalTest(description, function() {
      var context;
      context = {};
      setupSnapshot.call(context);
      testFn.call(context);
      return teardownSnapshot.call(context);
    });
  };
})(window);
