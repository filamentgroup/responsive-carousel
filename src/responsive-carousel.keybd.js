/*
 * responsive-carousel keyboard extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($) {
	var pluginName = "carousel",
		initSelector = "." + pluginName,
		navSelector = "." + pluginName + "-nav a",
		buffer,
		keyNav = function( e ) {
			if ( e.keyCode === 9 || e.keyCode >= 37 && e.keyCode <= 40 ) {
				e.preventDefault();
				clearTimeout( buffer );
				buffer = setTimeout(function() {
					var $carousel = $( e.target ).closest( initSelector );

					// stop autoplay
					var autoplayAttr = $carousel.attr( "data-autoplay" ),
							autoplay = (typeof autoplayAttr !== "undefined" && autoplayAttr.toLowerCase() !== "false");
					
					if ( autoplay ) {
						$carousel[ pluginName ]( "stop" );
					}				

					if( e.shiftKey && e.keyCode === 9 || e.keyCode === 37 || e.keyCode === 38 ){
						$carousel[ pluginName ]( "prev" );
					}
					else if( e.keyCode === 9 || e.keyCode === 39 || e.keyCode === 40 ){
						$carousel[ pluginName ]( "next" );
					}
				}, 200 );
			}
		};

	// Touch handling
	$( document )
		.bind( "click", function( e ) {
			if( $( e.target ).closest( initSelector ).length ){
				$( e.target )[ 0 ].focus();
			}
		})
		.bind( "keydown", function( e ){
			if( $( e.target ).closest( initSelector ) .length ){
				keyNav( e );
			}
		} );
}(jQuery));
