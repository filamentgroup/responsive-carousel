/*
 * responsive-carousel touch drag transition for next/active/prev
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($) {
	alert("Dfs")
	var pluginName = "carousel",
		initSelector = "." + pluginName,
		activeClass = pluginName + "-active",
		itemClass = pluginName + "-item",
		prevClass = itemClass + "-prev",
		nextClass = itemClass + "-next",
		dragThreshold = function( deltaX ){
			return Math.abs( deltaX ) > 4;
		},
		getActiveSlides = function( $carousel ){
			return [ $carousel.find( "." + prevClass ), $carousel.find( "." + activeClass ), $carousel.find( "." + nextClass ) ];
		};

	// Touch handling
	$( initSelector )
		.on( "dragmove", function( e, data ){

			var activeSlides = getActiveSlides( $( this ), data.deltaX );

			activeSlides[ 0 ].css( "-webkit-transform", "translateX(" + data.deltaX + "px)" );
			activeSlides[ 1 ].css( "-webkit-transform", "translateX(" + data.deltaX + "px)" );
			activeSlides[ 2 ].css( "-webkit-transform", "translateX(" + data.deltaX + "px)" );
			//activeSlides[ 1 ].css( "left", data.deltaX < 0 ? data.w + data.deltaX + "px" : -data.w + data.deltaX + "px" );
		} )
		.on( "dragend", function( e, data ){
			/*if( !dragThreshold( data.deltaX ) ){
				return;
			}
			var activeSlides = getActiveSlides( $( this ), data.deltaX ),
				newSlide = Math.abs( data.deltaX ) > 45;

			$( this ).one( navigator.userAgent.indexOf( "AppleWebKit" ) ? "webkitTransitionEnd" : "transitionEnd", function(){
				activeSlides[ 0 ].add( activeSlides[ 1 ] ).css( "left", "" );
				$( this ).trigger( "goto." + pluginName, activeSlides[ 1 ] );
			});

			if( newSlide ){
				activeSlides[ 0 ].removeClass( activeClass ).css( "left", data.deltaX > 0 ? data.w  + "px" : -data.w  + "px" );
				activeSlides[ 1 ].addClass( activeClass ).css( "left", 0 );
			}
			else {
				activeSlides[ 0 ].css( "left", 0);
				activeSlides[ 1 ].css( "left", data.deltaX > 0 ? -data.w  + "px" : data.w  + "px" );
			}*/
		} );

}(jQuery));