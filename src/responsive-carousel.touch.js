/*
 * responsive-carousel touch drag extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($) {
	
	var pluginName = "carousel",
		initSelector = "[data-"+ pluginName +"]",
		getMarginLeft = function( $elem ){
			return $elem[ 0 ].style.cssText.match( /margin\-left:\s*(-?[0-9]+)%/ ) && parseFloat( RegExp.$1 );
		},
		touchMethods = {
			_dragBehavior: function(){
				
				var origin, deltaX, deltaY,
					$contain = $( this ).find( "." + pluginName + "-contain"  ),
					currPercentMargin,
					currPXMargin,
					carouselWidth,
					containWidth,
					endLeft;

				$contain
					.bind( "touchstart", function( e ){
						var touches = e.touches || e.originalEvent.touches;
						origin = { "x": touches[ 0 ].pageX, "y": touches[ 0 ].pageY };
						currPercentMargin = getMarginLeft( $contain ) || 0;
						currPXMargin = parseFloat( $contain.css( "margin-left" ) );
						carouselWidth = $( this ).parent().width();
						containWidth = $contain.width();	
						$( this ).addClass( pluginName + "-dragging" );							
					} )
					.bind( "touchmove", function( e ){						
						var touches = e.touches || e.originalEvent.touches,
							curr = { "x": touches[ 0 ].pageX, "y": touches[ 0 ].pageY };
						
						deltaX = curr.x - origin.x;
						deltaY = curr.y - origin.y;
						
						var newLeft = currPXMargin + deltaX;
						
						if( Math.abs( newLeft ) <= containWidth && newLeft <= 0 ){
							$contain.css( "margin-left", newLeft + "px" );
						}
					} )
					.bind( "touchend", function( e ){							
						$( this ).removeClass( pluginName + "-dragging" );
						
						var newLeft = currPXMargin + deltaX;
						
						if( Math.abs( deltaX ) > 45 && Math.abs( newLeft ) < containWidth && newLeft < 0  ){
							endLeft = ( deltaX > 0 ? carouselWidth : -carouselWidth ) + currPXMargin;
						}
						else{
							endLeft = currPXMargin;
						}
						
						$contain
							.css( "margin-left", endLeft + "px" )
							.bind( "webkitTransitionEnd transitionend", function(){
								$( this )
									.css( "margin-left", endLeft / carouselWidth * 100 + "%" )
									.unbind( "webkitTransitionEnd transitionend" );
							});
					} );
			}
		};
			
	// add methods
	$.extend( $.fn[ pluginName ].prototype, touchMethods ); 
	
	// DOM-ready auto-init
	$( initSelector ).live( "create." + pluginName, function(){
		$( this )[ pluginName ]( "_dragBehavior" );
	} );

}(jQuery));