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
		itemClass = pluginName + "-item",
		activeClass = pluginName + "-active",
		nextClass = pluginName + "-item-next";

		getFocusedEl = function( $el ){
			return $el.find( document.activeElement );
		},

		stopAutoPlay = function( e ){
			var $carousel = $( e.target ).closest( initSelector ), 
					$focused = getFocusedEl( $carousel ),
					autoplayAttr = $carousel.attr( "data-autoplay" ),
					autoplay = (typeof autoplayAttr !== "undefined" && autoplayAttr.toLowerCase() !== "false");

			if ( autoplay && $focused.length ) {
				$carousel[ pluginName ]( "stop" );
				console.log( "stop");
			}	
		},

		keyNav = function( e ) {
			var $carousel = $( e.target ).closest( initSelector ),
					//focusables = "a, input, textarea, select",		
					buffer;			

			if ( e.keyCode >= 37 && e.keyCode <= 40 ) {
				e.preventDefault();
				clearTimeout( buffer );
				buffer = setTimeout(function() {

					// left or up
					if ( e.keyCode === 37 || e.keyCode === 38 ){
						$carousel[ pluginName ]( "prev" );
					}
					// right or down
					else if ( 
						e.keyCode === 39 || e.keyCode === 40 ){
						$carousel[ pluginName ]( "next" );
					}
				}, 200 );
			}
		};

	// Touch handling
	$( document )
		/*.bind( "click", function( e ) {
			if( $( e.target ).closest( initSelector ).length ){
				$( e.target )[ 0 ].focus();
			}
		})*/
		.bind( "keyup", function( e ){
			if( $( e.target ).closest( initSelector ).length ){
				stopAutoPlay( e );
			}
		})
		.bind( "keydown", function( e ){
			if( $( e.target ).closest( initSelector ).length ){
				keyNav( e );
			}
		});
}(jQuery));
