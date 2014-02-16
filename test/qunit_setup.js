(function() {
  var originalModule, originalTest, setupFn, teardownFn;

  setupFn = function() {
    return null;
  };

  teardownFn = function() {
    return null;
  };

  window.setup = function(fn) {
    return setupFn = fn;
  };

  window.teardown = function(fn) {
    return teardownFn = fn;
  };

  window.moreSetup = function(fn) {
    var origSetup;
    origSetup = setupFn;
    return setup(function() {
      origSetup.call(this);
      return fn.call(this);
    });
  };

  window.moreTeardown = function(fn) {
    var origTeardown;
    origTeardown = teardownFn;
    return teardown(function() {
      fn.call(this);
      return origTeardown.call(this);
    });
  };

  window.clearSetup = function() {
    setup(function() {
      return null;
    });
    return teardown(function() {
      return null;
    });
  };

  originalModule = window.module;

  window.module = function(description) {
    clearSetup();
    return originalModule(description);
  };

  originalTest = window.test;

  window.test = function(description, testFn) {
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

}).call(this);
