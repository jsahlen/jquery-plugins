(function($){

  $.fn.tabSwitcher = function() {
    var switchTab = function() {
      contentAreas.hide();
      var self = $(this);
      var tab = self.parents('li:first');
      var id = self.attr('href').replace(/^#/, '');
      tabs.removeClass('active');
      tab.addClass('active');
      contentAreas.each(function() {
        var ca = $(this);
        if (ca.attr('id') == id) ca.show();
      });
    }

    if (!this.length || this.length > 1) return this;

    var self = $(this);
    var tabs = self.find('.nav li');
    var contentAreas = self.find('div.content');

    tabs.find('a').click(function() {
      switchTab.apply(this);
      return false;
    });
    switchTab.apply(tabs.slice(0,1).find('a').get(0));

    return this;
  };

}(jQuery));