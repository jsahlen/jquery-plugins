/*!
 * Default Field Text jQuery Plugin
 * Copyright (c) 2009 Johan Sahlén
 * Licensed under the MIT license.
 */
(function($){

  $.fn.defaultFieldText = function(options) {
    options = jQuery.extend({
      defaultClass: "default",
      text: null,
      textSuffix: "",
      resetOnSubmit: true
    }, options);

    var setText = function(clear) {
      var field = $(this);
      var cur   = field.val();
      var def   = field.data('defaultText');

      if (clear && cur == def) {
        field.removeClass(options.defaultClass);
        field.val("");
      }

      if (!clear && (cur.match(/^\s*$/) || cur == def)) {
        field.addClass(options.defaultClass);
        field.val(def);
      }
    };

    this.each(function() {
      var field = $(this);
      var text  = "";

      if (options.text) {
        text = options.text;
      } else {
        var id    = field.attr("id");
        var label = $("label[for="+id+"]");
        text = label.text();
      }

      field.data("defaultText", text+options.textSuffix);

      field.bind("focus", function() {
        setText.call(this, true);
      }).blur(function() {
        setText.call(this);
      });

      setText.call(field);

      if (options.resetOnSubmit) {
        var form = field.parents("form:first");
        form.bind("submit", function() {
          setText.call(field, true);
        });
      }
    });

    return this;
  };

}(jQuery));
