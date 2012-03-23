jQuery ($) ->
  $.fn.autoresize = (options, selectors) ->
    s = @
    j = $(@)
    o = $.extend {
      log: true
      namespace: 'autoresize'
    }, options

    selectors = $.extend {
      expand:       'auto-expand'
      active:       'autoresize-active'
    }, selectors
    
    el = (key) -> return "#{selectors[key]}"
    cl = (key) -> return ".#{selectors[key]}"
    
    opt = o
    cls = selectors
    sel = {}; sel[key] = ".#{value}" for key, value of cls
    
    @construct = ->
      contain =
        shades: $('<div id="autoresize-contain-shades"></div>').appendTo(document.body)
        clones: $('<div id="autoresize-contain-clones"></div>').appendTo(document.body)
        
      j.each ->
        # create autoresize on demand
        input = null
        $(this).focus ->
          unless input?
            # elements
            input =
              first:      $(this).css('overflow','hidden')
              clone:      s.create_clone( $(this) ).appendTo(contain.clones)
              shade:      s.create_shade( $(this) ).appendTo(contain.shades)
              minHeight:  $(this).height()
            s.clone_show(input)
            # listen for clicks
            input.first.focus ->    s.clone_show(input)
            input.clone.blur ->     s.clone_hide(input)
            # listen for keystrokes
            input.clone.change ->   s.clone_refresh(input)
            input.clone.keyup ->    s.clone_refresh(input)
            input.clone.keydown ->  s.clone_refresh(input)
            # focus on the newely created clone
    
    @create_clone = (first) ->
      clone = first.clone().hide()
        .attr
          id:       ''
          name:     ''
        .css
          position:     'absolute'
          resize:       'none'
          overflow:     'hidden'
          border:       '1px solid #999'
      s.css_copy(first, clone)
      return clone
    
    @create_shade = (first) ->
      shade = $('<div></div>')
        .css
          position:       'absolute'
          top:            -10000
          left:           -10000
          resize:         'none'
          background:     'lightblue'
      s.css_copy(first, shade)
      return shade
    
    @css_copy = (source, target) ->
      target.css
        'width':          source.width()
        'font-size':      source.css('font-size')
        'font-family':    source.css('font-family')
        'font-weight':    source.css('font-weight')
        'line-height':    source.css('line-height')
        'text-align':     source.css('text-align')
        'padding-left':   source.css('padding-left')
        'padding-top':    source.css('padding-top')
        'padding-bottom': source.css('padding-bottom')
        'padding-right':  source.css('padding-right')

    @clone_show = (input) ->
      input.first.trigger "_show.#{opt.namespace}"
      input.first.addClass cls.active
      input.clone.val( input.first.val() )
      s.clone_refresh(input)
      s.css_copy(input.first, input.clone)
      input.clone
        .css
          top:    input.first.offset().top - 1
          left:   input.first.offset().left - 1
        .show().focus().scrollTop(10000)
    
    @clone_hide = (input) ->
      input.first.trigger "_hide.#{opt.namespace}"
      input.first.removeClass cls.active
      if input.first.val() != input.clone.val()
        input.first
          .val( input.clone.val() )
          .trigger('keyup').trigger('keydown').trigger('change')
      input.clone.hide()
      input.first.scrollTop(0)
    
    @clone_refresh = (input) ->
      s.shade_refresh_text(input)
      s.clone_resize(input)
    
    @clone_resize = (input) ->
      # update height
      input.clone.height( Math.max(input.shade.height() + 10, input.minHeight ) )

    @shade_refresh_text = (input) ->
      val = input.clone.val()
      html = val.replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/&/g, '&amp;')
        .replace(/\n/g, '<br/>')
      input.shade.html(html)

    @log = ->
      if o.log
        if (typeof console == "object")
          console.log( Array.prototype.slice.call(arguments) )
    
    @construct()
    
    return s