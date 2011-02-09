jquery.localize.js - a jQuery plugin that makes it easy to i18n your static web site.
===================================================================

Synopsis
--------

* Lazily loads JSON translation files based on a simple naming convention.
* By default, applies the translations to your document based on simple attribute convention.
* Recently updated for jQuery 1.5

Basic Usage
-----------

Step 1. Use the "rel" attribute on tags whose content you want to be translated
--------------------------------------------------------------------------

Somewhere in your html:

    <h1 rel="localize[greeting]"> Hello! </h1>

Step 2. Provide a JSON language file that has translations:
----------------------------------------------------------

example-fr.json:

    {
      greeting: "Bonjour!"
    }

Step 3. Use the localize plugin.
-------------------------------------

    // In a browser where the language is set to French
    $("rel*=localize").localize("example")

    // You can also override the language detection, and pass in a language code
    $("rel*=localize").localize("example", { language: "fr" })

Gory Details
============

Language file loading
---------------------

The first argument of the localize method is the name of the language pack.  You might have a different language pack for different parts of your website.

Here's an example of loading several language packs:

    $("rel*=localize")
      .localize("header")
      .localize("sidebar")
      .localize("footer")


If the language of the browser were set to "fr", then the plugin would try to load:

* header-fr.json
* sidebar-fr.json
* footer-fr.json

if the language of the browser also had a country code, like "fr-FR", then the plugin would ALSO try to load:

* header-fr-FR.json
* sidebar-fr-FR.json
* footer-fr-FR.json

This let's you define partial language refinements for different regions.  For instance, you can have the base language translation file for a language that translates 100 different phrases, and for countries were maybe a some of those phrases would be out of place, you can just provide a country-specific file with _just those special phrases_ defined.

Skipping Languages (aka Optimizing for My Language)
------------------
This is useful if you've got a default language.  For example, if all of your content is served in english, then you probably don't want the overhead of loading up unecessary (and probably non-existant) english langauge packs (foo-en.json)

You can tell the localize plugin to always skip certain languages using the skipLanguage option:

    # using a string will skip ONLY if the language code matches exactly
    # this would prevent loading only if the language was "en-US"
    $("rel*=localize").localize("example", { skipLanguage: "en-US" })

    # using a regex will skip if the regex matches
    # this would prevent loading of any english language translations
    $("rel*=localize").localize("example", { skipLanguage: /^en/ })

    # using an array of strings will skip if any of the strings matches exactly
    $("rel*=localize").localize("example", { skipLanguage: ["en", "en-US"] })

Applying the language file
--------------------------

If you rely on the default callback and follow the "rel" attribute conventions then the changes will be applied for you.

Examples:
---------

**HTML:**

    <p rel="localize[title]">Tracker Pro XT Deluxe</p>
    <p rel="localize[search.placeholder]">Search...</p>
    <p rel="localize[search.button]">Go!</p>
    <p rel="localize[footer.disclaimer]">Use at your own risk.</p>
    <p rel="localize[menu.dashboard]">Dashboard</p>
    <p rel="localize[menu.list]">Bug List</p>
    <p rel="localize[menu.logout]">Logout</p>

**application-es.json (fake spanish)**

    {
      title: "Tracker Pro XT Deluxo",
      search: {
        placeholder: "Searcho...",
        button: "Vamos!"
      },
      footer: {
        disclaimer: "Bewaro."
      },
      menu: {
        dashboard: "Dashboardo",
        list: "Bug Listo",
        logout: "Exito"
      }
    }

**Localize it!**

    $("rel*=localize").localize("application", { language: "es" })

Callbacks
---------

You can provide a callback if you want to augment or replace the default callback provided by the plugin.  Your callback should take at least 1 argument: the language data (contents of your json file).  It can optionally accept a second argument, which is a reference to the default callback function.  This is handy if you still want the default behavior, but also need to do something else with the language data.

    $("rel*=localize").localize("application", {
      language: "es",
      callback: function(data, defaultCallback){
        data.title = data.title + currentBugName();
        defaultCallback(data)
      }
    })

See the tests for working examples.

Credits & Licensing
-------------------

Copyright (c) Jim Garvin (http://github.com/coderifous), 2008.

Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses.

Written by Jim Garvin (@coderifous) for use on LMGTFY.com.
Please use it, and contribute changes.

http://github.com/coderifous/jquery-localize

Based off of Keith Wood's Localisation jQuery plugin.
http://keith-wood.name/localisation.html
