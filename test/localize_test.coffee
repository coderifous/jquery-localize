localizableTagWithRel = (tag, localizeKey, attributes) ->
  t = $("<#{tag}>").attr("rel", "localize[#{localizeKey}]")
  applyTagAttributes(t, attributes)

localizableTagWithDataLocalize = (tag, localizeKey, attributes) ->
  t = $("<#{tag}>").attr("data-localize", localizeKey)
  applyTagAttributes(t, attributes)

applyTagAttributes = (tag, attributes) ->
  if attributes.text?
    tag.text(attributes.text)
    delete attributes.text
  if attributes.val?
    tag.val(attributes.val)
    delete attributes.val
  tag.attr(k,v) for k, v of attributes
  tag

module "Basic Usage"

setup ->
  @testOpts = language: "ja", pathPrefix: "lang"

test "basic tag text substitution", ->
  t = localizableTagWithRel("p", "basic", text: "basic fail")
  t.localize("test", @testOpts)
  equals t.text(), "basic success"

test "basic tag text substitution using data-localize instead of rel", ->
  t = localizableTagWithDataLocalize("p", "basic", text: "basic fail")
  t.localize("test", @testOpts)
  equals t.text(), "basic success"

test "basic tag text substitution with nested key", ->
  t = localizableTagWithRel("p", "test.nested", text: "nested fail")
  t.localize("test", @testOpts)
  equals t.text(), "nested success"

test "basic tag text substitution for special title key", ->
  t = localizableTagWithDataLocalize("p", "with_title", text: "with_title element fail", title: "with_title title fail")
  t.localize("test", @testOpts)
  equals t.text(), "with_title text success"
  equals t.attr("title"), "with_title title success"

test "input tag value substitution", ->
  t = localizableTagWithRel("input", "test.input", val: "input fail")
  t.localize("test", @testOpts)
  equals t.val(), "input success"

test "input tag placeholder substitution", ->
  t = localizableTagWithRel("input", "test.input", placeholder: "placeholder fail")
  t.localize("test", @testOpts)
  equals t.attr("placeholder"), "input success"

test "titled input tag value substitution", ->
  t = localizableTagWithRel("input", "test.input_as_obj", val: "input_as_obj fail")
  t.localize("test", @testOpts)
  equals t.val(), "input_as_obj value success"

test "titled input tag title substitution", ->
  t = localizableTagWithRel("input", "test.input_as_obj", val: "input_as_obj fail")
  t.localize("test", @testOpts)
  equals t.attr("title"), "input_as_obj title success"

test "titled input tag placeholder substitution", ->
  t = localizableTagWithRel("input", "test.input_as_obj", placeholder: "placeholder fail")
  t.localize("test", @testOpts)
  equals t.attr("placeholder"), "input_as_obj value success"

test "image tag src, alt, and title substitution", ->
  t = localizableTagWithRel("img", "test.ruby_image", src: "ruby_square.gif", alt: "a square ruby", title: "A Square Ruby")
  t.localize("test", @testOpts)
  equals t.attr("src"), "ruby_round.gif"
  equals t.attr("alt"), "a round ruby"
  equals t.attr("title"), "A Round Ruby"

test "chained call", ->
  t = localizableTagWithRel("p", "basic", text: "basic fail")
  t.localize("test", @testOpts).localize("test", @testOpts)
  equals t.text(), "basic success"

test "alternative file extension", ->
  t = localizableTagWithRel("p", "basic", text: "basic fail")
  t.localize("test", $.extend({ fileExtension: "foo" }, @testOpts))
  equals t.text(), "basic success foo"

moreSetup ->
  @t = $('<select>
      <optgroup rel="localize[test.optgroup]" label="optgroup fail">
        <option rel="localize[test.option]" value="1">option fail</option>
      </optgroup>
    </select>')

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
  t = localizableTagWithRel("p", "path_prefix", text: "pathPrefix fail")
  t.localize("test", opts)
  equals t.text(), "pathPrefix success"

test "custom callback is fired", ->
  opts = language: "ja", pathPrefix: "lang"
  opts.callback = (data, defaultCallback) ->
    data.custom_callback = "custom callback success"
    defaultCallback(data)
  t = localizableTagWithRel("p", "custom_callback", text: "custom callback fail")
  t.localize("test", opts)
  equals t.text(), "custom callback success"

test "language with country code", ->
  opts = language: "ja-XX", pathPrefix: "lang"
  t = localizableTagWithRel("p", "message", text: "country code fail")
  t.localize("test", opts)
  equals t.text(), "country code success"

module "Language optimization"

test "skipping language using string match", ->
  opts = language: "en", pathPrefix: "lang", skipLanguage: "en"
  t = localizableTagWithRel("p", "en_message", text: "en not loaded")
  t.localize("test", opts)
  equals t.text(), "en not loaded"

test "skipping language using regex match", ->
  opts = language: "en-US", pathPrefix: "lang", skipLanguage: /^en/
  t = localizableTagWithRel("p", "en_us_message", text: "en-US not loaded")
  t.localize("test", opts)
  equals t.text(), "en-US not loaded"

test "skipping language using array match", ->
  opts = language: "en", pathPrefix: "lang", skipLanguage: ["en", "en-US"]
  t = localizableTagWithRel("p", "en_message", text: "en not loaded")
  t.localize("test", opts)
  equals t.text(), "en not loaded"

  opts = language: "en-US", pathPrefix: "lang", skipLanguage: ["en", "en-US"]
  t = localizableTagWithRel("p", "en_us_message", text: "en-US not loaded")
  t.localize("test", opts)
  equals t.text(), "en-US not loaded"
