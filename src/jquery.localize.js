// Copyright (c) Jim Garvin (http://github.com/coderifous), 2008.
// Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses.
// Written by Jim Garvin (@coderifous) for use on LMGTFY.com.
// http://github.com/coderifous/jquery-localize
// Based off of Keith Wood's Localisation jQuery plugin.
// http://keith-wood.name/localisation.html

(function($) {
  $.localize = function(pkg, options) {
    var $wrappedSet          = this;
    var intermediateLangData = {};
    options = options || {};
    var saveSettings = {async: $.ajaxSettings.async, timeout: $.ajaxSettings.timeout};
    $.ajaxSetup({async: false, timeout: (options && options.timeout ? options.timeout : 500)});

    function loadLanguage(pkg, lang, level) {
      level = level || 1;
      var file;
      if (options && options.loadBase && level == 1) {
        intermediateLangData = {};
        file = pkg + '.json';
        jsonCall(file, pkg, lang, level);
      }
      else if (level == 1) {
        intermediateLangData = {};
        loadLanguage(pkg, lang, 2);
      }
      else if (level == 2 && lang.length >= 2) {
        file = pkg + '-' + lang.substring(0, 2) + '.json';
        jsonCall(file, pkg, lang, level);
      }
      else if (level == 3 && lang.length >= 5) {
        file = pkg + '-' + lang.substring(0, 5) + '.json';
        jsonCall(file, pkg, lang, level);
      }
    }

    function jsonCall(file, pkg, lang, level) {
      if (options.pathPrefix) file = options.pathPrefix + "/" + file;
      $.getJSON(file, null, function(d){
        $.extend(intermediateLangData, d);
        notifyDelegateLanguageLoaded(intermediateLangData);
        loadLanguage(pkg, lang, level + 1);
      });
    }

    function defaultCallback(data) {
      $.localize.data[pkg] = data;
      var keys, value;
      $wrappedSet.each(function(){
        elem = $(this);
        key = elem.attr("rel").match(/localize\[(.*?)\]/)[1];
        value = valueForKey(key, data);
        if (elem.is('input')) {
          elem.val(value);
        }
        else {
          elem.html(value);
        }
      });
    }

    function notifyDelegateLanguageLoaded(data) {
      if (options.callback) {
        // pass the defaultCallback so it can be used in addition to some custom behavior
        options.callback(data, defaultCallback);
      }
      else {
        defaultCallback(data);
      }
    }

    function valueForKey(key, data){
      var keys  = key.split(/\./);
      var value = data;
      while (keys.length > 0) {
        if(value){
          value = value[keys.shift()];
        }
        else{
          return null;
        }
      }
      return value;
    }

    function regexify(string_or_regex_or_array){
      if (typeof(string_or_regex_or_array) == "string") {
        return "^" + string_or_regex_or_array + "$";
      }
      else if (string_or_regex_or_array.length) {
        var matchers = [];
        var x = string_or_regex_or_array.length;
        while (x--) {
          matchers.push(regexify(string_or_regex_or_array[x]));
        }
        return matchers.join("|");
      }
      else {
        return string_or_regex_or_array;
      }
    }

    var lang = normaliseLang(options && options.language ? options.language : $.defaultLanguage);

    if (options.skipLanguage && lang.match( regexify(options.skipLanguage) )) return;
    loadLanguage(pkg, lang, 1);

    $.ajaxSetup(saveSettings);
  };

  $.fn.localize = $.localize;

  // Storage for retrieved data
  $.localize.data = {};

  // Retrieve the default language set for the browser.
  $.defaultLanguage = normaliseLang(navigator.language
    ? navigator.language       // Mozilla
    : navigator.userLanguage   // IE
  );

  // Ensure language code is in the format aa-AA.
  function normaliseLang(lang) {
   lang = lang.replace(/_/, '-').toLowerCase();
   if (lang.length > 3) {
     lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
   }
   return lang;
  }
})(jQuery);
