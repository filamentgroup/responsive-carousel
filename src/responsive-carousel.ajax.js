/*
 * responsive-carousel ajax include extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($) {
	
	var pluginName = "carousel",
		initSelector = "." + pluginName;
	
	// DOM-ready auto-init
	$( initSelector ).on( "ajaxInclude", function(){
		$( this )[ pluginName ]( "update" );
	} );
	
	// kick off ajaxIncs at dom ready
	$( function(){
		$( "[data-after],[data-before]", initSelector ).ajaxInclude();
	} );

}(jQuery));