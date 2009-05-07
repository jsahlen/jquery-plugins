/*!
 * YALx - Yet Another Lightbox
 * Copyright (c) 2009 Johan Sahlén
 * Licensed under the MIT license.
 */
(function($){

  /**
    * Main plugin function.
    * @param [opts] The options you give here will extend
    *     {@link $.fn.YALx.defaults}
    */
  $.fn.YALx = function(opts) {
    var opts = $.extend({}, $.fn.YALx.defaults, opts);

    var links = $(this), elements = {};
    var visible = false, working = false, currentIndex = 0;
    var win = $(window), doc = $(document);
    var currentWidth = 0, currentHeight = 0;

    /**
      * Load a new image.
      * @param {String} src The URI of the new image
      */
    var loadImage = function(src, index) {
      currentIndex = index;

      _show();

      var currentImage = elements.container.find('img');

      if (currentImage.attr('src') == src) return;
      showLoader();

      var preloader = new Image;
      preloader.src = src;
      $(preloader).bind('load', function() {
        hideLoader();

        if (currentImage.length) {
          currentImage.animate({ opacity: 0 }, opts.imageFadeSpeed, null, function() {
            elements.container.find('img').remove();
            _processImage(src, preloader.width, preloader.height);
          })
        } else {
          _processImage(src, preloader.width, preloader.height);
        }
      }).bind('error', function() {
        hideLoader();
      });
    };

    /**
      * After an image has been downloaded.
      */
    var _processImage = function(src, width, height) {
      var container = elements.container;
      var padding = opts.padding * 2;

      var image = $('<img src="'+src+'"></img>').css({ opacity: 0 });

      if (!(width != currentWidth || height != currentHeight)) {
        container.append(image);
        image.animate({ opacity: 1 }, opts.imageFadeSpeed);
        return;
      }

      var animationOpts = {
        width:  width,
        height: height,
        left:   ((doc.width() - (width + padding)) / 2),
        top:    (((win.height() - (height + padding)) / 2) + win.scrollTop())
      };

      container.animate(animationOpts, opts.resizeSpeed, opts.easing, function() {
        container.append(image);
        image.animate({ opacity: 1 }, opts.imageFadeSpeed);
      });

      currentWidth  = width;
      currentHeight = height;
    };

    /**
      * Show the lightbox. Bind window events.
      */
    var _show = function() {
      if (visible) return;

      _createElements();

      var backdrop  = elements.backdrop;
      var container = elements.container;
      
      backdrop
        .css({ width: doc.width(), height: doc.height(), display: 'block' })
        .animate({ opacity: opts.backdropOpacity }, opts.fadeInSpeed);

      if (!container.find('img').length) {
        var dimensions = opts.loaderDimensions;
        container.css({ width: dimensions[0], height: dimensions[1] });
      }

      elements.container
        .css({
          display: 'block',
          left: ((doc.width() - container.width()) / 2),
          top: (((win.height() - container.height()) / 2) + win.scrollTop())
        })
        .animate({ opacity: 1 }, opts.fadeInSpeed);

      if (elements.help) elements.help
        .css({ display: 'block' })
        .animate({ opacity: 1 }, opts.fadeInSpeed);

      visible = true;
      win.bind('keyup.yalx', _handleKeypress);
      win.bind('scroll.yalx', _repositionContainer);
    };

    /**
      * Create the DOM elements for the lightbox.
      */
    var _createElements = function() {
      // Do nothing if they already exist
      if (elements.backdrop) return;

      // Create the elements and make them invisible
      var backdrop  = $('<div id="'+opts.backdropId+'"></div>').css({ display: 'none', opacity: 0 });
      var container = $('<div id="'+opts.containerId+'"></div>').css({ display: 'none', opacity: 0 });
      var loader    = $('<div class="'+opts.loaderClass+'"></div>').hide();

      var help = null;
      if (opts.help) help = $('<p id="'+opts.helpId+'">'+opts.help+'</p>').css({ display: 'none', opacity: 0 });

      backdrop.click(hide);

      container.append(loader);
      
      $('body')
        .append(backdrop)
        .append(container)
        .append(help);
      
      elements = {
        backdrop:  backdrop,
        container: container,
        loader:    loader,
        help:      help
      };
    };

    /**
      * Reposition the container based on scroll position.
      */
    var _repositionContainer = function() {
      var container = elements.container;
      if (!container.is(':animated')) {
        container.css({ top: (((win.height() - container.height()) / 2) + win.scrollTop()) });
      }
    };

    /**
      * Step to the next or previous picture.
      * @param {String} [direction='next'] 'next' or 'previous'
      */
    var step = function(direction) {
      var direction = direction || 'next';

      var newIndex = -1;

      if (direction == 'previous' && currentIndex > 0) newIndex = currentIndex - 1;
      else if (direction == 'next' && currentIndex < links.length-1) newIndex = currentIndex + 1;

      if (newIndex >= 0) {
        var link = links.slice(newIndex, newIndex+1);
        loadImage(link.attr('href'), newIndex);
      }
    };

    /**
      * Hide the lightbox. Unbind window events.
      */
    var hide = function() {
      elements.backdrop.add(elements.container).add(elements.help).animate({ opacity: 0 }, opts.fadeOutSpeed, null, function() {
        $(this).css({ display: 'none' });
        visible = false;
        win.unbind('keyup.yalx');
        win.unbind('scroll.yalx');
      });
    };

    /**
      * Show the loader. Sets 'working' status to true and positions the
      * loader within the container before displaying it.
      */
    var showLoader = function() {
      var loader     = elements.loader;
      var container  = elements.container;
      var dimensions = opts.loaderDimensions;

      working = true;

      loader.css({
        top: (container.innerHeight() - dimensions[1]) / 2,
        left: (container.innerWidth() - dimensions[0]) / 2
      });

      loader.show();
    };

    /**
      * Hide the loader. Also set 'working' status to false.
      */
    var hideLoader = function() {
      working = false;
      elements.loader.hide();
    };

    /**
      * Handle all keypress events while the lightbox is visible. ESC hides
      * the lightbox, left arrow steps to the previous picture, right arrow
      * steps to the next one.
      */
    var _handleKeypress = function(e) {
      if (working) return;

      if (e.keyCode == 37) step('previous');
      else if (e.keyCode == 39) step('next');
      else if (e.keyCode == 27) hide();
    };

    // Bind events
    links.each(function(index) {
      var link = $(this);
      link.click(function() {
        loadImage(link.attr('href'), index);
        return false;
      });
    });
  };

  /**
    * Default options. Overwrite or extend this to set options for all uses
    * of the plugin.
    */
  $.fn.YALx.defaults = {
    loaderDimensions: [32,32],
    backdropId:       "yalx_backdrop",
    containerId:      "yalx",
    loaderClass:      "loader",
    padding:          5,
    backdropOpacity:  0.9,
    easing:           "swing",
    resizeSpeed:      200,
    fadeInSpeed:      200,
    fadeOutSpeed:     100,
    imageFadeSpeed:   100,
    helpId:           "yalx_help",
    help:             "You can use your left/right arrow keys to navigate between pictures. ESC to close."
  };

}(jQuery));
