/*
 * responsive-carousel touch drag transition
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($) {

	var pluginName = "carousel",
		initSelector = "." + pluginName,
		activeClass = pluginName + "-active",
		itemClass = pluginName + "-item",
		dragThreshold = function( deltaX ){
			return Math.abs( deltaX ) > 4;
		},
		getActiveSlides = function( $carousel, deltaX ){
			var $from = $carousel.find( "." + pluginName + "-active" ),
				activeNum = $from.prevAll().length + 1,
				forward = deltaX < 0,
				nextNum = activeNum + (forward ? 1 : -1),
				$to = $carousel.find( "." + itemClass ).eq( nextNum - 1 );

			if( !$to.length ){
				$to = $carousel.find( "." + itemClass )[ forward ? "first" : "last" ]();
			}

			return [ $from, $to, nextNum-1 ];
		};

	// Touch handling
	$( document )
		.bind( pluginName + ".dragmove", function( e, data ){
			if( !!data && !dragThreshold( data.deltaX ) ){
				return;
			}
			if( $( e.target ).attr( "data-transition" ) === "slide" ){
				var activeSlides = getActiveSlides( $( e.target ), data.deltaX );

				activeSlides[ 0 ].css( "left", data.deltaX + "px" );
				activeSlides[ 1 ].css( "left", data.deltaX < 0 ? data.w + data.deltaX + "px" : -data.w + data.deltaX + "px" );
			}
		} )
		.bind( pluginName + ".dragend", function( e, data ){
			if( !!data && !dragThreshold( data.deltaX ) ){
				return;
			}
			var activeSlides = getActiveSlides( $( e.target ), data.deltaX ),
				newSlide = Math.abs( data.deltaX ) > 45;

			if( $( e.target ).attr( "data-transition" ) === "slide" ){
				$( e.target ).one( navigator.userAgent.indexOf( "AppleWebKit" ) ? "webkitTransitionEnd" : "transitionEnd", function(){
					activeSlides[ 0 ].add( activeSlides[ 1 ] ).css( "left", "" );
					$( e.target ).trigger( "goto." + pluginName, activeSlides[ newSlide ? 1 : 0 ] );
				});

				if( newSlide ){
					activeSlides[ 0 ].removeClass( activeClass ).css( "left", data.deltaX > 0 ? data.w  + "px" : -data.w  + "px" );
					activeSlides[ 1 ].addClass( activeClass ).css( "left", 0 );
				}
				else {
					activeSlides[ 0 ].css( "left", 0);
					activeSlides[ 1 ].css( "left", data.deltaX > 0 ? -data.w  + "px" : data.w  + "px" );
				}
			}
			else if( newSlide ){
				$( e.target )[ pluginName ]( data.deltaX > 0 ? "prev" : "next" );
			}
		} );

}(jQuery));
