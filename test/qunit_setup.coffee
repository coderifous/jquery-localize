setupFn = -> null
teardownFn = -> null
window.setup = (fn) -> setupFn = fn
window.teardown = (fn) -> teardownFn = fn

window.moreSetup = (fn) ->
  origSetup = setupFn
  setup ->
    origSetup.call(this)
    fn.call(this)

window.moreTeardown = (fn) ->
  origTeardown = teardownFn
  teardown ->
    fn.call(this)
    origTeardown.call(this)

window.clearSetup = ->
  setup -> null
  teardown -> null

originalModule = window.module
window.module = (description) ->
  clearSetup()
  originalModule(description)

originalTest = window.test
window.test = (description, testFn) ->
  setupSnapshot = setupFn
  teardownSnapshot = teardownFn
  originalTest description, ->
    context = {}
    setupSnapshot.call(context)
    testFn.call(context)
    teardownSnapshot.call(context)
