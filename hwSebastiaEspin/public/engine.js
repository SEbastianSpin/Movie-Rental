//jshint esversion:6

$.fn.stars = function() {
    return $(this).each(function() {
        // Get the value
        var val = parseFloat($(this).html());
        // Make sure that the value is in 0 - 5 range, multiply to get width
        var size = Math.max(0, (Math.min(5, val))) * 16;
        // Create stars holder
        var $span = $('<span />').width(size);
        // Replace the numerical value with stars
        $(this).html($span);
    });
};

$(function() {
    $('span.stars').stars();
});


function price(s) {
  var selected = s.selectedIndex;
let n=  $('#value').text();
n = parseInt(n);
  selected = parseInt(selected);
  n=(selected*n)+(selected*n*0.23);



$('#cost').val(n);

}
