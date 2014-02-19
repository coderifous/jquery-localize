do (global = window) ->
  setupFn = -> null
  teardownFn = -> null
  global.setup = (fn) -> setupFn = fn
  global.teardown = (fn) -> teardownFn = fn

  global.moreSetup = (fn) ->
    origSetup = setupFn
    setup ->
      origSetup.call(this)
      fn.call(this)

  global.moreTeardown = (fn) ->
    origTeardown = teardownFn
    teardown ->
      fn.call(this)
      origTeardown.call(this)

  global.clearSetup = ->
    setup -> null
    teardown -> null

  originalModule = global.module
  global.module = (description) ->
    clearSetup()
    originalModule(description)

  originalTest = global.test
  global.test = (description, testFn) ->
    setupSnapshot = setupFn
    teardownSnapshot = teardownFn
    originalTest description, ->
      context = {}
      setupSnapshot.call(context)
      testFn.call(context)
      teardownSnapshot.call(context)
