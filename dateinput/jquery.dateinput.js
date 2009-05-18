(function($) {
  $.fn.dateinput = function(options) {
    var settings = $.extend({
      replaceAllText: false
    }, options || {});
    
    // adapted from http://en.wikipedia.org/wiki/Leap_year
    var isLeapYear = function(yr) {
      if (yr % 400 == 0 || (yr % 4 == 0 && yr % 100 != 0)) return true;
      return false;
    };
    
    var re = /(\d\d)(\d\d)(\d\d)/;
    
    var parseISO = function(six_digits) {
      var match = re.exec(six_digits);
      if (match) {
        var yr = parseInt(20+match[3]); var mo = parseInt(match[1], 10) - 1; var day = parseInt(match[2], 10);
        if (mo > 11 || mo == -1) return false;
        if (day > 31 || day == 0) return false;
        if (day == 31 && (mo == 1 || mo == 3 || mo == 5 || mo == 8 || mo == 10)) return false;
        if (isLeapYear(yr) && mo == 1 && day > 29) return false;
        if (!isLeapYear(yr) && mo == 1 && day > 28) return false;
        return yr + "-" + match[1] + "-" + match[2]
      };
    };
    
    return this.each(function() {
      var self = $(this);
      self.blur(function() {
        var txt = self.val();
        var iso = parseISO(txt);
        if (iso) {
          if (settings.replaceAllText) {
            self.val(iso);
          } else {
            self.val(txt.replace(re, iso));            
          };
        };
      });
      
    });
  };
})(jQuery);