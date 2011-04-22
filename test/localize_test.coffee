localizableTag = (tag, localizeKey, attributes) ->
  t = $("<#{tag}>").attr("rel", "localize[#{localizeKey}]")
  if attributes.text?
    t.text(attributes.text)
    delete attributes.text
  if attributes.val?
    t.val(attributes.val)
    delete attributes.val
  t.attr(k,v) for k, v of attributes
  t

module "Basic Usage"

setup ->
  @testOpts = language: "ja", pathPrefix: "lang"

test "basic tag text substitution", ->
  t = localizableTag("p", "basic", text: "basic fail")
  t.localize("test", @testOpts)
  equals t.text(), "basic success"

test "basic tag text substitution with nested key", ->
  t = localizableTag("p", "test.nested", text: "nested fail")
  t.localize("test", @testOpts)
  equals t.text(), "nested success"

test "input tag value substitution", ->
  t = localizableTag("input", "test.input", val: "input fail")
  t.localize("test", @testOpts)
  equals t.val(), "input success"

test "image tag src and alt substitution", ->
  t = localizableTag("img", "test.ruby_image", src: "ruby_square.gif", alt: "a square ruby")
  t.localize("test", @testOpts)
  equals t.attr("src"), "ruby_round.gif"
  equals t.attr("alt"), "a round ruby"

moreSetup ->
  @t = $('
    <select>
      <optgroup rel="localize[test.optgroup]" label="optgroup fail">
        <option rel="localize[test.option]" value="1">option fail</option>
      </optgroup>
    </select>
  ')

test "optgroup tag label substitution", ->
  t = @t.find("optgroup")
  t.localize("test", @testOpts)
  equals t.attr("label"), "optgroup success"

test "option tag text substitution", ->
  t = @t.find("option")
  t.localize("test", @testOpts)
  equals t.text(), "option success"

module "Options"

test "pathPrefix loads lang files from custom path", ->
  opts =  language: "fo", pathPrefix: "/test/lang/custom"
  t = localizableTag("p", "path_prefix", text: "pathPrefix fail")
  t.localize("test", opts)
  equals t.text(), "pathPrefix success"

test "custom callback is fired", ->
  opts = language: "ja", pathPrefix: "lang"
  opts.callback = (data, defaultCallback) ->
    data.custom_callback = "custom callback success"
    defaultCallback(data)
  t = localizableTag("p", "custom_callback", text: "custom callback fail")
  t.localize("test", opts)
  equals t.text(), "custom callback success"

test "language with country code", ->
  opts = language: "ja-XX", pathPrefix: "lang"
  t = localizableTag("p", "message", text: "country code fail")
  t.localize("test", opts)
  equals t.text(), "country code success"

module "Language optimization"

test "skipping language using string match", ->
  opts = language: "en", pathPrefix: "lang", skipLanguage: "en"
  t = localizableTag("p", "en_message", text: "en not loaded")
  t.localize("test", opts)
  equals t.text(), "en not loaded"

test "skipping language using regex match", ->
  opts = language: "en-US", pathPrefix: "lang", skipLanguage: /^en/
  t = localizableTag("p", "en_us_message", text: "en-US not loaded")
  t.localize("test", opts)
  equals t.text(), "en-US not loaded"

test "skipping language using array match", ->
  opts = language: "en", pathPrefix: "lang", skipLanguage: ["en", "en-US"]
  t = localizableTag("p", "en_message", text: "en not loaded")
  t.localize("test", opts)
  equals t.text(), "en not loaded"

  opts = language: "en-US", pathPrefix: "lang", skipLanguage: ["en", "en-US"]
  t = localizableTag("p", "en_us_message", text: "en-US not loaded")
  t.localize("test", opts)
  equals t.text(), "en-US not loaded"
