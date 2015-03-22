(function($) {
  var applyTagAttributes, localizableTagWithDataLocalize, localizableTagWithRel;
  localizableTagWithRel = function(tag, localizeKey, attributes) {
    var t;
    t = $("<" + tag + ">").attr("rel", "localize[" + localizeKey + "]");
    return applyTagAttributes(t, attributes);
  };
  localizableTagWithDataLocalize = function(tag, localizeKey, attributes) {
    var t;
    t = $("<" + tag + ">").attr("data-localize", localizeKey);
    return applyTagAttributes(t, attributes);
  };
  applyTagAttributes = function(tag, attributes) {
    var k, v;
    if (attributes.text != null) {
      tag.text(attributes.text);
      delete attributes.text;
    }
    if (attributes.val != null) {
      tag.val(attributes.val);
      delete attributes.val;
    }
    for (k in attributes) {
      v = attributes[k];
      tag.attr(k, v);
    }
    return tag;
  };
  module("Basic Usage");
  setup(function() {
    return this.testOpts = {
      language: "ja",
      pathPrefix: "lang"
    };
  });
  test("basic tag text substitution", function() {
    var t;
    t = localizableTagWithRel("p", "basic", {
      text: "basic fail"
    });
    t.localize("test", this.testOpts);
    return equal(t.text(), "basic success");
  });
  test("basic tag text substitution using data-localize instead of rel", function() {
    var t;
    t = localizableTagWithDataLocalize("p", "basic", {
      text: "basic fail"
    });
    t.localize("test", this.testOpts);
    return equal(t.text(), "basic success");
  });
  test("basic tag text substitution with nested key", function() {
    var t;
    t = localizableTagWithRel("p", "test.nested", {
      text: "nested fail"
    });
    t.localize("test", this.testOpts);
    return equal(t.text(), "nested success");
  });
  test("basic tag text substitution for special title key", function() {
    var t;
    t = localizableTagWithDataLocalize("p", "with_title", {
      text: "with_title element fail",
      title: "with_title title fail"
    });
    t.localize("test", this.testOpts);
    equal(t.text(), "with_title text success");
    return equal(t.attr("title"), "with_title title success");
  });
  test("input tag value substitution", function() {
    var t;
    t = localizableTagWithRel("input", "test.input", {
      val: "input fail"
    });
    t.localize("test", this.testOpts);
    return equal(t.val(), "input success");
  });
  test("input tag value after second localization without key", function() {
    var t;
    t = localizableTagWithRel("input", "test.input", {
      val: "input fail"
    });
    t.localize("test", this.testOpts);
    t.localize("test2", this.testOpts);
    return equal(t.val(), "input success");
  });
  test("input tag placeholder substitution", function() {
    var t;
    t = localizableTagWithRel("input", "test.input", {
      placeholder: "placeholder fail"
    });
    t.localize("test", this.testOpts);
    return equal(t.attr("placeholder"), "input success");
  });
  test("textarea tag placeholder substitution", function() {
    var t;
    t = localizableTagWithRel("textarea", "test.input", {
      placeholder: "placeholder fail"
    });
    t.localize("test", this.testOpts);
    return equal(t.attr("placeholder"), "input success");
  });
  test("titled input tag value substitution", function() {
    var t;
    t = localizableTagWithRel("input", "test.input_as_obj", {
      val: "input_as_obj fail"
    });
    t.localize("test", this.testOpts);
    return equal(t.val(), "input_as_obj value success");
  });
  test("titled input tag title substitution", function() {
    var t;
    t = localizableTagWithRel("input", "test.input_as_obj", {
      val: "input_as_obj fail"
    });
    t.localize("test", this.testOpts);
    return equal(t.attr("title"), "input_as_obj title success");
  });
  test("titled input tag placeholder substitution", function() {
    var t;
    t = localizableTagWithRel("input", "test.input_as_obj", {
      placeholder: "placeholder fail"
    });
    t.localize("test", this.testOpts);
    return equal(t.attr("placeholder"), "input_as_obj value success");
  });
  test("image tag src, alt, and title substitution", function() {
    var t;
    t = localizableTagWithRel("img", "test.ruby_image", {
      src: "ruby_square.gif",
      alt: "a square ruby",
      title: "A Square Ruby"
    });
    t.localize("test", this.testOpts);
    equal(t.attr("src"), "ruby_round.gif");
    equal(t.attr("alt"), "a round ruby");
    return equal(t.attr("title"), "A Round Ruby");
  });
  test("link tag href substitution", function() {
    var t;
    t = localizableTagWithRel("a", "test.link", {
      href: "http://fail",
      text: "fail"
    });
    t.localize("test", this.testOpts);
    equal(t.attr("href"), "http://success");
    return equal(t.text(), "success");
  });
  test("chained call", function() {
    var t;
    t = localizableTagWithRel("p", "basic", {
      text: "basic fail"
    });
    t.localize("test", this.testOpts).localize("test", this.testOpts);
    return equal(t.text(), "basic success");
  });
  test("alternative file extension", function() {
    var t;
    t = localizableTagWithRel("p", "basic", {
      text: "basic fail"
    });
    t.localize("test", $.extend({
      fileExtension: "foo"
    }, this.testOpts));
    return equal(t.text(), "basic success foo");
  });
  moreSetup(function() {
    return this.t = $('<select> <optgroup rel="localize[test.optgroup]" label="optgroup fail"> <option rel="localize[test.option]" value="1">option fail</option> </optgroup> </select>');
  });
  test("optgroup tag label substitution", function() {
    var t;
    t = this.t.find("optgroup");
    t.localize("test", this.testOpts);
    return equal(t.attr("label"), "optgroup success");
  });
  test("option tag text substitution", function() {
    var t;
    t = this.t.find("option");
    t.localize("test", this.testOpts);
    return equal(t.text(), "option success");
  });
  module("Options");
  test("fallback language loads", function() {
    var opts, t;
    opts = {
      language: "fo",
      fallback: "ja",
      pathPrefix: "lang"
    };
    t = localizableTagWithRel("p", "basic", {
      text: "basic fail"
    });
    t.localize("test", opts);
    return equal(t.text(), "basic success");
  });
  test("pathPrefix loads lang files from custom path", function() {
    var opts, t;
    opts = {
      language: "fo",
      pathPrefix: "/test/lang/custom"
    };
    t = localizableTagWithRel("p", "path_prefix", {
      text: "pathPrefix fail"
    });
    t.localize("test", opts);
    return equal(t.text(), "pathPrefix success");
  });
  test("custom callback is fired", function() {
    var opts, t;
    opts = {
      language: "ja",
      pathPrefix: "lang"
    };
    opts.callback = function(data, defaultCallback) {
      data.custom_callback = "custom callback success";
      return defaultCallback(data);
    };
    t = localizableTagWithRel("p", "custom_callback", {
      text: "custom callback fail"
    });
    t.localize("test", opts);
    return equal(t.text(), "custom callback success");
  });
  test("language with country code", function() {
    var opts, t;
    opts = {
      language: "ja-XX",
      pathPrefix: "lang"
    };
    t = localizableTagWithRel("p", "message", {
      text: "country code fail"
    });
    t.localize("test", opts);
    return equal(t.text(), "country code success");
  });
  module("Language optimization");
  test("skipping language using string match", function() {
    var opts, t;
    opts = {
      language: "en",
      pathPrefix: "lang",
      skipLanguage: "en"
    };
    t = localizableTagWithRel("p", "en_message", {
      text: "en not loaded"
    });
    t.localize("test", opts);
    return equal(t.text(), "en not loaded");
  });
  test("skipping language using regex match", function() {
    var opts, t;
    opts = {
      language: "en-US",
      pathPrefix: "lang",
      skipLanguage: /^en/
    };
    t = localizableTagWithRel("p", "en_us_message", {
      text: "en-US not loaded"
    });
    t.localize("test", opts);
    return equal(t.text(), "en-US not loaded");
  });
  return test("skipping language using array match", function() {
    var opts, t;
    opts = {
      language: "en",
      pathPrefix: "lang",
      skipLanguage: ["en", "en-US"]
    };
    t = localizableTagWithRel("p", "en_message", {
      text: "en not loaded"
    });
    t.localize("test", opts);
    equal(t.text(), "en not loaded");
    opts = {
      language: "en-US",
      pathPrefix: "lang",
      skipLanguage: ["en", "en-US"]
    };
    t = localizableTagWithRel("p", "en_us_message", {
      text: "en-US not loaded"
    });
    t.localize("test", opts);
    return equal(t.text(), "en-US not loaded");
  });
})(jQuery);
