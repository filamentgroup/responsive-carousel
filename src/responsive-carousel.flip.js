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
		topClass = pluginName + "-top",
		itemClass = pluginName + "-item",
		dragThreshold = function( xPercent ){
			return (xPercent > -1 && xPercent < 0) || (xPercent < 1 && xPercent > 0);
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

			return [ $from, $to ];
		};

	// Touch handling
	$( document )
		.bind( pluginName + ".dragstart", function( e, data ){
			$( e.target ).find( "." + topClass ).removeClass( topClass );
		})
		.bind( pluginName + ".dragmove", function( e, data ){
			if( !dragThreshold( data.xPercent ) ){
				return;
			}
			var activeSlides = getActiveSlides( $( e.target ), data.deltaX ),
				degs = data.xPercent * 180,
				halfWay = Math.abs(data.xPercent) > 0.5;

			activeSlides[ 0 ].css( "-webkit-transform", "rotateY("+ degs +"deg)" );
			activeSlides[ 1 ].css( "-webkit-transform", "rotateY("+ ( ( degs > 0 ? -180 : 180 ) + degs ) +"deg)");

			activeSlides[ halfWay ? 1 : 0 ].addClass( topClass );
			activeSlides[ halfWay ? 0 : 1 ].removeClass( topClass );

		} )
		.bind( pluginName + ".dragend", function( e, data ){
			if( !dragThreshold( data.xPercent ) ){
				return;
			}
			var activeSlides = getActiveSlides( $( e.target ), data.deltaX ),
				newSlide = Math.abs( data.xPercent ) > 0.5;

			if( newSlide ){
				activeSlides[ 0 ].removeClass( activeClass );
				activeSlides[ 1 ].addClass( activeClass );
			}
			else {
				activeSlides[ 0 ].addClass( activeClass );
				activeSlides[ 1 ].removeClass( activeClass );
			}

			activeSlides[ 0 ].add( activeSlides[ 1 ] ).removeClass( topClass ).css( "-webkit-transform", "" );

		} );

}(jQuery));