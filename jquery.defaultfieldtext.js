(function($){

  /**
   * Default Field Text jQuery Plugin
   * By Johan Sahlén
   */
  

  $.fn.defaultFieldText = function(options) {
    var options = jQuery.extend({
      defaultClass: "default",
      text: null,
      textSuffix: "",
      resetOnSubmit: true
    }, options);

    var setText = function(clear) {
      var field = $(this);
      var cur   = field.val();
      var def   = field.data.defaultText;

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
        var id    = field.attr('id');
        var label = $('label[for='+id+']');
        text = label.text();
      }

      field.data.defaultText = text+options.textSuffix;

      field.focus(function() {
        setText.call(this, true);
      }).blur(function() {
        setText.call(this);
      });

      setText.call(field.get(0));

      if (options.resetOnSubmit) {
        var form = field.parents('form:first');
        form.submit(function() {
          setText.call(field.get(0), true);
        });
      }
    });

    return this;
  };

}(jQuery));