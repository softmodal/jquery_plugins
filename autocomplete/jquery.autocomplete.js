(function($) {
  $(function() { $("body").append("<div id='ac_suggestion_box'></div>") });
  var ac_current_input = {};
  $.fn.autocomplete = function(options) {
    var defaults = {};
    var options = $.extend(defaults, options);
  
    var suggestion_box = $("#ac_suggestion_box");
    var selected_class = "ui-state-highlight";
    var tag_type = "p";
    var selected_entry_name = tag_type + "." + selected_class;
  
    var insert_wildcards = function(text) {
      //make it match space or period between letters
      //return text.replace(/(\S)/g, "$1(?: |\.)*");
      //make it match anything between letters
      return text.replace(/(\S)/g, "$1.*");
    };
  
    var match = function(input, src) {
      if (!input) return false;
      var re = new RegExp("^"+insert_wildcards(input), "gi");
      return re.exec(src);
    };
   
    var clear_suggestion_box = function() {
      suggestion_box.hide().html("");
    };
  
    var scroll_suggestion_box = function(entry) {
      var scrolltop = suggestion_box.attr("scrollTop");
      if (entry.offset().top < suggestion_box.offset().top) {
        suggestion_box.attr("scrollTop", 
          scrolltop - (suggestion_box.offset().top - entry.offset().top + 1));
      };
      if (entry.offset().top + entry.height() > 
          suggestion_box.offset().top + suggestion_box.height()) {    
        var panel = entry.offset().top;
        var divtop = suggestion_box.offset().top;
        var divheight = suggestion_box.height();
        var panelheight = entry.height() + parseInt(entry.css("padding-top").replace("px", ""));
        suggestion_box.attr("scrollTop", scrolltop - (divtop - panel) - divheight + panelheight);
      };
    };
  
    suggestion_box.mouseover(function(e) {
      if ($(e.target).attr("tagName").toLowerCase() == tag_type) {
        $(selected_entry_name).removeClass(selected_class)
        $(e.target).addClass(selected_class)
      };
    }).mousedown(function(e) {
      if ($(e.target).attr("tagName").toLowerCase() == tag_type) {
        ac_current_input.val($(selected_entry_name).html());
        return false;
      };
    }).mouseup(function() {
      clear_suggestion_box();
    });

    return this.each(function() {
      var self = $(this);
      self.attr("autocomplete", "off");
      self.keyup(function(e) {
        var k = e.keyCode;
        if (k > 48 && k < 90 || k > 96 && k < 105 || k == 110 || k > 199 && k < 190 || k == 8) {
          suggestion_box
            .html("") 
            .css({
              "top":  self.offset().top + self.height() + 8,
              "left": self.offset().left
            });
          var str = "";
          for (i=0; i<self.list.length; i++) {
            if (match(self.val(), self.list[i])) {
              var even = "";
              if (i % 2 == 0) even = " class='ac_even'";
              str += "<"+tag_type+even+">" + self.list[i] + "</"+tag_type+">";
            };
          };
          if (str) {
            suggestion_box.html(str).show().attr("scrollTop", 0).css("zIndex", 1000000);
            $(suggestion_box.children()[0]).addClass(selected_class);
          } else {
            clear_suggestion_box();
          };
          return false;
        };
      }).keydown(function(e) {
        var k = e.keyCode;
        var selected_entry = $(selected_entry_name)
        if (k == 38) {
          var prev = $(selected_entry.prev());
          if (prev.attr("tagName")) {
            selected_entry.removeClass(selected_class);
            prev.addClass(selected_class);
            scroll_suggestion_box(prev);
          };
          return false;
        } else if (k == 40) {
          var next = $(selected_entry.next());
          if (next.attr("tagName")) {
            selected_entry.removeClass(selected_class);
            next.addClass(selected_class);
            scroll_suggestion_box(next);
          };
          return false;
        } else if (k == 13 || k == 9) {
          var txt = selected_entry.html();
          if (txt) self.val(txt);
          clear_suggestion_box();
          if (k == 13) return false; //for safari
        };
      }).blur(function(e) {
        clear_suggestion_box();
      }).focus(function(e) {
        self.list = eval(self.attr("list"));
        ac_current_input = self;
      });
      self.focus();
    });
  };
})(jQuery);