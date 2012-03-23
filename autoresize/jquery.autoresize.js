(function() {
  jQuery(function($) {
    return $.fn.autoresize = function(options, selectors) {
      var cl, cls, el, j, key, o, opt, s, sel, value;
      s = this;
      j = $(this);
      o = $.extend({
        log: true,
        namespace: 'autoresize'
      }, options);
      selectors = $.extend({
        expand: 'auto-expand',
        active: 'autoresize-active'
      }, selectors);
      el = function(key) {
        return "" + selectors[key];
      };
      cl = function(key) {
        return "." + selectors[key];
      };
      opt = o;
      cls = selectors;
      sel = {};
      for (key in cls) {
        value = cls[key];
        sel[key] = "." + value;
      }
      this.construct = function() {
        var contain;
        contain = {
          shades: $('<div id="autoresize-contain-shades"></div>').appendTo(document.body),
          clones: $('<div id="autoresize-contain-clones"></div>').appendTo(document.body)
        };
        return j.each(function() {
          var input;
          input = null;
          return $(this).focus(function() {
            if (input == null) {
              input = {
                first: $(this).css('overflow', 'hidden'),
                clone: s.create_clone($(this)).appendTo(contain.clones),
                shade: s.create_shade($(this)).appendTo(contain.shades),
                minHeight: $(this).height()
              };
              s.clone_show(input);
              input.first.focus(function() {
                return s.clone_show(input);
              });
              input.clone.blur(function() {
                return s.clone_hide(input);
              });
              input.clone.change(function() {
                return s.clone_refresh(input);
              });
              input.clone.keyup(function() {
                return s.clone_refresh(input);
              });
              return input.clone.keydown(function() {
                return s.clone_refresh(input);
              });
            }
          });
        });
      };
      this.create_clone = function(first) {
        var clone;
        clone = first.clone().hide().attr({
          id: '',
          name: ''
        }).css({
          position: 'absolute',
          resize: 'none',
          overflow: 'hidden',
          border: '1px solid #999'
        });
        s.css_copy(first, clone);
        return clone;
      };
      this.create_shade = function(first) {
        var shade;
        shade = $('<div></div>').css({
          position: 'absolute',
          top: -10000,
          left: -10000,
          resize: 'none',
          background: 'lightblue'
        });
        s.css_copy(first, shade);
        return shade;
      };
      this.css_copy = function(source, target) {
        return target.css({
          'width': source.width(),
          'font-size': source.css('font-size'),
          'font-family': source.css('font-family'),
          'font-weight': source.css('font-weight'),
          'line-height': source.css('line-height'),
          'text-align': source.css('text-align'),
          'padding-left': source.css('padding-left'),
          'padding-top': source.css('padding-top'),
          'padding-bottom': source.css('padding-bottom'),
          'padding-right': source.css('padding-right')
        });
      };
      this.clone_show = function(input) {
        input.first.trigger("_show." + opt.namespace);
        input.first.addClass(cls.active);
        input.clone.val(input.first.val());
        s.clone_refresh(input);
        s.css_copy(input.first, input.clone);
        return input.clone.css({
          top: input.first.offset().top - 1,
          left: input.first.offset().left - 1
        }).show().focus().scrollTop(10000);
      };
      this.clone_hide = function(input) {
        input.first.trigger("_hide." + opt.namespace);
        input.first.removeClass(cls.active);
        if (input.first.val() !== input.clone.val()) {
          input.first.val(input.clone.val()).trigger('keyup').trigger('keydown').trigger('change');
        }
        input.clone.hide();
        return input.first.scrollTop(0);
      };
      this.clone_refresh = function(input) {
        s.shade_refresh_text(input);
        return s.clone_resize(input);
      };
      this.clone_resize = function(input) {
        return input.clone.height(Math.max(input.shade.height() + 10, input.minHeight));
      };
      this.shade_refresh_text = function(input) {
        var html, val;
        val = input.clone.val();
        html = val.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;').replace(/\n/g, '<br/>');
        return input.shade.html(html);
      };
      this.log = function() {
        if (o.log) {
          if (typeof console === "object") {
            return console.log(Array.prototype.slice.call(arguments));
          }
        }
      };
      this.construct();
      return s;
    };
  });
}).call(this);
