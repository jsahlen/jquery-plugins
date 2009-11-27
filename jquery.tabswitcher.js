(function($){

  $.fn.tabSwitcher = function(options) {
    options = jQuery.extend({
      activeClass: 'active',
      tabParentPath: 'li:first',
      tabPath: '.nav li',
      contentPath: 'div.content'
    }, options);

    var switchTab = function() {
      contentAreas.hide();
      var self = $(this);
      var tab = self.parents(options.tabParentPath);
      var id = self.attr('href').replace(/^#/, '');
      tabs.removeClass(options.activeClass);
      tab.addClass(options.activeClass);
      contentAreas.each(function() {
        var ca = $(this);
        if (ca.attr('id') == id) ca.show();
      });
    };

    if (!this.length || this.length > 1) return this;

    var self = $(this);
    var tabs = self.find(options.tabPath);
    var contentAreas = self.find(options.contentPath);

    tabs.find('a').click(function() {
      switchTab.apply(this);
      return false;
    });
    switchTab.apply(tabs.slice(0,1).find('a').get(0));

    return this;
  };

}(jQuery));