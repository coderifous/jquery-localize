(function() {
  var $, normaliseLang;
  $ = jQuery;
  normaliseLang = function(lang) {
    lang = lang.replace(/_/, '-').toLowerCase();
    if (lang.length > 3) {
      lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
    }
    return lang;
  };
  $.defaultLanguage = normaliseLang(navigator.language || navigator.userLanguage);
  $.localize = function(pkg, options) {
    var defaultCallback, intermediateLangData, jsonCall, lang, loadLanguage, notifyDelegateLanguageLoaded, regexify, valueForKey, wrappedSet;
    if (options == null) {
      options = {};
    }
    wrappedSet = this;
    intermediateLangData = {};
    loadLanguage = function(pkg, lang, level) {
      var file;
      if (level == null) {
        level = 1;
      }
      switch (level) {
        case 1:
          intermediateLangData = {};
          if (options.loadBase) {
            file = pkg + '.json';
            return jsonCall(file, pkg, lang, level);
          } else {
            return loadLanguage(pkg, lang, 2);
          }
          break;
        case 2:
          if (lang.length >= 2) {
            file = "" + pkg + "-" + (lang.substring(0, 2)) + ".json";
            return jsonCall(file, pkg, lang, level);
          }
          break;
        case 3:
          if (lang.length >= 5) {
            file = "" + pkg + "-" + (lang.substring(0, 5)) + ".json";
            return jsonCall(file, pkg, lang, level);
          }
      }
    };
    jsonCall = function(file, pkg, lang, level) {
      var ajaxOptions, successFunc;
      if (options.pathPrefix != null) {
        file = "" + options.pathPrefix + "/" + file;
      }
      successFunc = function(d) {
        $.extend(intermediateLangData, d);
        notifyDelegateLanguageLoaded(intermediateLangData);
        return loadLanguage(pkg, lang, level + 1);
      };
      ajaxOptions = {
        url: file,
        dataType: "json",
        async: false,
        timeout: options.timeout != null ? options.timeout : 500,
        success: successFunc
      };
      if (window.location.protocol === "file:") {
        ajaxOptions.error = function(xhr) {
          return successFunc($.parseJSON(xhr.responseText));
        };
      }
      return $.ajax(ajaxOptions);
    };
    defaultCallback = function(data) {
      $.localize.data[pkg] = data;
      return wrappedSet.each(function() {
        var elem, key, value;
        elem = $(this);
        key = elem.attr("rel").match(/localize\[(.*?)\]/)[1];
        value = valueForKey(key, data);
        if (elem.is('input')) {
          if (elem.is("[placeholder]")) {
            return elem.attr("placeholder", value);
          } else {
            return elem.val(value);
          }
        } else if (elem.is('optgroup')) {
          return elem.attr("label", value);
        } else if (elem.is('img')) {
          value = valueForKey("" + key + ".alt", data);
          if (value != null) {
            elem.attr("alt", value);
          }
          value = valueForKey("" + key + ".src", data);
          if (value != null) {
            return elem.attr("src", value);
          }
        } else {
          return elem.html(value);
        }
      });
    };
    notifyDelegateLanguageLoaded = function(data) {
      if (options.callback != null) {
        return options.callback(data, defaultCallback);
      } else {
        return defaultCallback(data);
      }
    };
    valueForKey = function(key, data) {
      var keys, value, _i, _len;
      keys = key.split(/\./);
      value = data;
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        value = value != null ? value[key] : null;
      }
      return value;
    };
    regexify = function(string_or_regex_or_array) {
      var thing;
      if (typeof string_or_regex_or_array === "string") {
        return "^" + string_or_regex_or_array + "$";
      } else if (string_or_regex_or_array.length != null) {
        return ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = string_or_regex_or_array.length; _i < _len; _i++) {
            thing = string_or_regex_or_array[_i];
            _results.push(regexify(thing));
          }
          return _results;
        })()).join("|");
      } else {
        return string_or_regex_or_array;
      }
    };
    lang = normaliseLang(options.language ? options.language : $.defaultLanguage);
    if (!(options.skipLanguage && lang.match(regexify(options.skipLanguage)))) {
      return loadLanguage(pkg, lang, 1);
    }
  };
  $.fn.localize = $.localize;
  $.localize.data = {};
}).call(this);
