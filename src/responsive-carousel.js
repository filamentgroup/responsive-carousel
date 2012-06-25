/*
 * responsive-carousel
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($) {

	// Collection method.
	$.fn.carousel = function() {
		return this.each(function() {
		  $(this).addClass('carousel');
		});
	};
  
	// DOM-ready auto-init
	$(function(){
		$( "[data-carousel]" ).carousel();
	});

}(jQuery));
