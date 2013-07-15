/*
 * responsive-carousel touch drag transition for next/active/prev
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($) {
	var pluginName = "carousel",
		initSelector = "." + pluginName,
		opacityHigh = 1,
		opacityLow = 1,
		nextprevScale = 0.6,
		activeClass = pluginName + "-active",
		itemClass = pluginName + "-item",
		transitionPrefix = "-" + $.fn[ pluginName ].transitionPrefix,
		prevClass = itemClass + "-prev",
		nextClass = itemClass + "-next",
		dragThreshold = function( deltaX ){
			return Math.abs( deltaX ) > 4;
		},
		getActiveSlides = function( $carousel ){
			return [ $carousel.find( "." + prevClass ), $carousel.find( "." + activeClass ), $carousel.find( "." + nextClass ) ];
		};

	// Touch handling
	$( document )
		.on( "dragstart", initSelector, function( e, data ){
			var activeSlides = getActiveSlides( $( this ) ),
				prevTransform = activeSlides[ 0 ].css( "-webkit-transform" );

			opacityLow = parseFloat( activeSlides[ 0 ].css( "opacity" ) );
			//nextprevScale = prevTransform.match( /matrix\(([d]+)/ );

		})
		.on( "dragmove", initSelector, function( e, data ){

			var activeSlides = getActiveSlides( $( this ) ),
				transform = transitionPrefix + "Transform",
				percent = data.xPercent >= 0 ? Math.min( data.xPercent, 0.5 ) : Math.max( data.xPercent, -0.5 ),
				posPercent = Math.abs( percent ),
				prevScale = percent < 0 ? nextprevScale : Math.max( ( percent <= 0.5 ? percent : 1 - percent ) * 2, nextprevScale ),
				nextScale = percent > 0 ? nextprevScale : Math.max( ( posPercent <= 0.5 ? posPercent : 1 - posPercent ) * 2, nextprevScale ),
				activeScale = Math.max( 1 - posPercent, nextprevScale ),
				changeX = percent * 100;

			activeSlides[ 0 ].css({ "-webkit-transform": "scale(" + prevScale + ") translateX(" + ( changeX + 40 ) + "%)", opacity: opacityLow + posPercent });
			activeSlides[ 1 ].css({ "-webkit-transform": "scale(" + activeScale + ") translateX(" + changeX + "%)"  });
			activeSlides[ 2 ].css({ "-webkit-transform": "scale(" + nextScale + ") translateX(" + ( changeX + -40 ) + "%)", opacity: opacityLow + posPercent });
		} )
		.on( "dragend", initSelector, function( e, data ){
			if( !dragThreshold( data.deltaX ) ){
				return;
			}
			var activeSlides = getActiveSlides( $( this ) );

			
			function unstyle(){
				activeSlides[ 0 ].add( activeSlides[ 1 ] ).add( activeSlides[ 2 ] ).attr("style", "");
			}

			unstyle();

			$( this ).trigger( "goto." + pluginName, activeSlides[ data.deltaX > 0 ? 0 : 2 ] );
		} );

}(jQuery));
